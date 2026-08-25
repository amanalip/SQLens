import {
  QueryModel,
  QueryType,
  TableSource,
  JoinClause,
  FilterCondition,
  AggregateClause,
  SortClause,
  LimitClause,
  Projection,
  CTENode,
  SubqueryNode,
  JoinType,
} from '../model/query';

// Helper to stringify an AST expression node
export function exprToString(expr: unknown): string {
  if (!expr) return '';
  if (typeof expr === 'string') return expr;
  if (typeof expr === 'number') return String(expr);

  const node = expr as Record<string, unknown>;

  if (node.type === 'star' || node.value === '*') return '*';

  if (node.type === 'column_ref') {
    const table = node.table ? `${node.table}.` : '';
    const column = typeof node.column === 'object' && node.column !== null
      ? (node.column as { value?: string }).value || '*'
      : node.column || '*';
    return `${table}${column}`;
  }

  if (node.type === 'single_quote_string' || node.type === 'string') {
    return `'${node.value}'`;
  }

  if (node.type === 'number') {
    return String(node.value);
  }

  if (node.type === 'null') {
    return 'NULL';
  }

  if (node.type === 'bool') {
    return String(node.value).toUpperCase();
  }

  if (node.type === 'aggr_func') {
    const funcName = (node.name as string) || 'AGG';
    const argsObj = node.args as Record<string, unknown> | undefined;
    const inner = argsObj ? exprToString(argsObj.expr || argsObj) : '';
    const distinct = (argsObj as { distinct?: boolean })?.distinct ? 'DISTINCT ' : '';
    return `${funcName}(${distinct}${inner})`;
  }

  if (node.type === 'function') {
    const funcName = node.name ? (typeof node.name === 'object' ? (node.name as { name?: { value: string }[] }).name?.[0]?.value : node.name) : 'FUNC';
    const argsObj = node.args as Record<string, unknown> | undefined;
    const args = Array.isArray(argsObj?.value)
      ? (argsObj?.value as unknown[]).map((a: unknown) => exprToString(a)).join(', ')
      : exprToString(argsObj);
    return `${funcName}(${args})`;
  }

  if (node.type === 'binary_expr') {
    const left = exprToString(node.left);
    const right = exprToString(node.right);
    return `${left} ${node.operator} ${right}`;
  }

  if (node.type === 'unary_expr') {
    return `${node.operator} ${exprToString(node.expr)}`;
  }

  if (node.type === 'cast') {
    return `CAST(${exprToString(node.expr)} AS ${node.target ? exprToString(node.target) : 'TEXT'})`;
  }

  if (node.type === 'case') {
    return 'CASE ... END';
  }

  if (node.type === 'expr_list') {
    if (Array.isArray(node.value)) {
      return `(${node.value.map((v: unknown) => exprToString(v)).join(', ')})`;
    }
  }

  if (node.ast) {
    return '(SELECT ...)';
  }

  if (node.value !== undefined) {
    return String(node.value);
  }

  try {
    return JSON.stringify(expr);
  } catch {
    return String(expr);
  }
}

// Extract all column references from an expression
export function extractColumnsFromExpr(expr: unknown, list: string[] = []): string[] {
  if (!expr || typeof expr !== 'object') return list;

  const node = expr as Record<string, unknown>;

  if (node.type === 'column_ref') {
    const colName = exprToString(node);
    if (colName && !list.includes(colName)) {
      list.push(colName);
    }
  }

  if (node.left) extractColumnsFromExpr(node.left, list);
  if (node.right) extractColumnsFromExpr(node.right, list);
  if (node.expr) extractColumnsFromExpr(node.expr, list);
  if (node.args) extractColumnsFromExpr(node.args, list);
  if (Array.isArray(node.value)) {
    node.value.forEach((v) => extractColumnsFromExpr(v, list));
  }

  return list;
}

export function analyzeAst(ast: unknown, rawSql: string): QueryModel {
  const node = (ast || {}) as Record<string, unknown>;
  const queryTypeStr = String(node.type || 'select').toUpperCase();
  const queryType: QueryType =
    queryTypeStr === 'SELECT'
      ? 'SELECT'
      : queryTypeStr === 'INSERT'
      ? 'INSERT'
      : queryTypeStr === 'UPDATE'
      ? 'UPDATE'
      : queryTypeStr === 'DELETE'
      ? 'DELETE'
      : 'UNKNOWN';

  const ctes: CTENode[] = [];
  const sources: TableSource[] = [];
  const joins: JoinClause[] = [];
  const filters: FilterCondition[] = [];
  const orderBy: SortClause[] = [];
  const projections: Projection[] = [];
  const subqueries: SubqueryNode[] = [];
  let groupBy: AggregateClause | undefined;
  let having: FilterCondition | undefined;
  let limit: LimitClause | undefined;

  let hasStarProjection = false;
  let hasCartesianJoin = false;
  let hasCorrelatedSubquery = false;

  // Process CTEs (WITH clause)
  if (Array.isArray(node.with)) {
    for (const cte of node.with) {
      const cteName = typeof cte.name === 'string' ? cte.name : cte.name?.value || 'cte';
      const cteAst = cte.stmt?.ast || cte.stmt || cte;
      const cteModel = analyzeAst(cteAst, '');
      ctes.push({
        name: cteName,
        model: cteModel,
      });
    }
  }

  // Process FROM and JOINs (or target table for INSERT / UPDATE / DELETE)
  let fromList = Array.isArray(node.from) ? node.from : node.from ? [node.from] : [];
  if (fromList.length === 0 && node.table) {
    fromList = Array.isArray(node.table) ? node.table : [node.table];
  }
  let primaryTable = '';

  fromList.forEach((item: Record<string, unknown>, index: number) => {
    // Check if it's a subquery in FROM
    if (item.expr && (item.expr as Record<string, unknown>).ast) {
      const subAst = (item.expr as Record<string, unknown>).ast;
      const subModel = analyzeAst(subAst, '');
      const subAlias = item.as ? String(item.as) : `subquery_${index + 1}`;
      subqueries.push({
        id: `sub_${index}`,
        alias: subAlias,
        location: 'FROM',
        model: subModel,
      });
      sources.push({
        id: `src_sub_${index}`,
        name: `(${subAlias})`,
        alias: subAlias,
      });
      if (index === 0) primaryTable = subAlias;
      return;
    }

    const tableName = String(item.table || item.name || `table_${index + 1}`);
    const tableAlias = item.as ? String(item.as) : undefined;
    const tableIdentifier = tableAlias || tableName;

    if (index === 0) {
      primaryTable = tableIdentifier;
      sources.push({
        id: `src_${index}`,
        name: tableName,
        alias: tableAlias,
        schema: item.db ? String(item.db) : undefined,
      });
    } else {
      // Joined table
      sources.push({
        id: `src_${index}`,
        name: tableName,
        alias: tableAlias,
        schema: item.db ? String(item.db) : undefined,
      });

      const rawJoinType = String(item.join || 'INNER JOIN').toUpperCase();
      let joinType: JoinType = 'INNER';
      if (rawJoinType.includes('LEFT')) joinType = 'LEFT';
      else if (rawJoinType.includes('RIGHT')) joinType = 'RIGHT';
      else if (rawJoinType.includes('FULL')) joinType = 'FULL';
      else if (rawJoinType.includes('CROSS')) joinType = 'CROSS';
      else if (rawJoinType.includes('NATURAL')) joinType = 'NATURAL';

      const onCondition = item.on ? exprToString(item.on) : undefined;
      const usingCols = Array.isArray(item.using) && item.using.length > 0
        ? item.using.map((u) => {
            if (typeof u === 'string') return u;
            if (u && typeof u === 'object') {
              const uObj = u as Record<string, unknown>;
              return String(uObj.column || uObj.value || exprToString(u));
            }
            return String(u);
          })
        : undefined;

      if (!onCondition && !usingCols && joinType !== 'CROSS' && joinType !== 'NATURAL') {
        hasCartesianJoin = true;
      }

      joins.push({
        id: `join_${index}`,
        type: joinType,
        leftTable: primaryTable,
        rightTable: tableIdentifier,
        onCondition,
        usingColumns: usingCols,
      });
    }
  });

  // Process Projections (SELECT columns)
  const columnsList = Array.isArray(node.columns)
    ? node.columns
    : node.columns === '*'
    ? [{ expr: { type: 'star', column: '*' } }]
    : [];

  columnsList.forEach((col: Record<string, unknown>, index: number) => {
    const isStar =
      col.expr === '*' ||
      (col.expr && typeof col.expr === 'object' && (col.expr as Record<string, unknown>).type === 'star') ||
      (col.expr && typeof col.expr === 'object' && (col.expr as Record<string, unknown>).column === '*') ||
      col.type === 'star' ||
      col.column === '*';

    if (isStar) {
      hasStarProjection = true;
    }

    const exprStr = exprToString(col.expr || col);
    const aliasStr = col.as ? String(col.as) : undefined;
    const tableStr =
      col.expr && typeof col.expr === 'object' && (col.expr as Record<string, unknown>).table
        ? String((col.expr as Record<string, unknown>).table)
        : undefined;

    projections.push({
      id: `proj_${index}`,
      raw: aliasStr ? `${exprStr} AS ${aliasStr}` : exprStr,
      expr: exprStr,
      alias: aliasStr,
      table: tableStr,
      isStar: Boolean(isStar),
    });
  });

  // Process WHERE clause
  if (node.where) {
    const whereStr = exprToString(node.where);
    const cols = extractColumnsFromExpr(node.where);
    filters.push({
      id: 'filter_where',
      raw: whereStr,
      type: 'WHERE',
      columns: cols,
    });
  }

  // Process GROUP BY
  if (node.groupby) {
    const groupItems = Array.isArray(node.groupby)
      ? node.groupby
      : Array.isArray((node.groupby as Record<string, unknown>).columns)
      ? (node.groupby as { columns: unknown[] }).columns
      : [node.groupby];

    const groupCols: string[] = [];
    groupItems.forEach((g: unknown) => {
      const s = exprToString(g);
      if (s) groupCols.push(s);
    });

    if (groupCols.length > 0) {
      groupBy = {
        id: 'groupby_node',
        columns: groupCols,
        raw: groupCols.join(', '),
      };
    }
  }

  // Process HAVING
  if (node.having) {
    const havingStr = exprToString(node.having);
    const cols = extractColumnsFromExpr(node.having);
    having = {
      id: 'filter_having',
      raw: havingStr,
      type: 'HAVING',
      columns: cols,
    };
  }

  // Process ORDER BY
  if (Array.isArray(node.orderby)) {
    node.orderby.forEach((order: Record<string, unknown>, index: number) => {
      const colStr = exprToString(order.expr);
      const dir = String(order.type || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      orderBy.push({
        id: `order_${index}`,
        column: colStr,
        direction: dir,
      });
    });
  }

  // Process LIMIT
  if (node.limit) {
    const limitObj = node.limit as Record<string, unknown>;
    if (Array.isArray(limitObj.value)) {
      const sep = String(limitObj.seperator || limitObj.separator || '').toLowerCase();
      const first = Number(limitObj.value[0]?.value ?? limitObj.value[0]);
      const second = limitObj.value[1] !== undefined ? Number(limitObj.value[1]?.value ?? limitObj.value[1]) : undefined;

      if (sep === ',' && second !== undefined) {
        // MySQL LIMIT offset, count
        limit = {
          count: !isNaN(second) ? second : 0,
          offset: !isNaN(first) ? first : undefined,
        };
      } else {
        // Standard LIMIT count OFFSET offset
        limit = {
          count: !isNaN(first) ? first : 0,
          offset: second !== undefined && !isNaN(second) ? second : undefined,
        };
      }
    } else if (limitObj.value !== undefined) {
      const val = Number(limitObj.value);
      limit = { count: !isNaN(val) ? val : 0 };
    }
  }

  return {
    id: `query_${Date.now()}`,
    rawSql,
    queryType,
    ctes,
    sources,
    joins,
    filters,
    groupBy,
    having,
    orderBy,
    limit,
    projections,
    subqueries,
    hasStarProjection,
    hasCartesianJoin,
    hasCorrelatedSubquery,
  };
}

// Robust fallback parsing using regex heuristics when AST parser encounters errors
export function analyzeWithFallback(sql: string): QueryModel {
  const clean = sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const selectMatch = clean.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  const fromMatch = clean.match(/FROM\s+([a-zA-Z0-9_]+(?:\s+(?:AS\s+)?[a-zA-Z0-9_]+)?)/i);
  const whereMatch = clean.match(/WHERE\s+([\s\S]+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|;|$)/i);
  const groupMatch = clean.match(/GROUP\s+BY\s+([\s\S]+?)(?:\s+HAVING|\s+ORDER\s+BY|\s+LIMIT|;|$)/i);
  const orderMatch = clean.match(/ORDER\s+BY\s+([\s\S]+?)(?:\s+LIMIT|;|$)/i);
  const limitMatch = clean.match(/LIMIT\s+(\d+)/i);

  const sources: TableSource[] = [];
  if (fromMatch && fromMatch[1]) {
    const parts = fromMatch[1].trim().split(/\s+(?:AS\s+)?/i);
    sources.push({
      id: 'src_fallback_0',
      name: parts[0],
      alias: parts[1],
    });
  }

  const projections: Projection[] = [];
  let hasStar = false;
  if (selectMatch && selectMatch[1]) {
    const cols = selectMatch[1].split(',');
    cols.forEach((colStr, idx) => {
      const trimmed = colStr.trim();
      if (trimmed === '*') hasStar = true;
      projections.push({
        id: `proj_fallback_${idx}`,
        raw: trimmed,
        expr: trimmed,
        isStar: trimmed === '*',
      });
    });
  }

  const filters: FilterCondition[] = [];
  if (whereMatch && whereMatch[1]) {
    filters.push({
      id: 'filter_fallback_where',
      raw: whereMatch[1].trim(),
      type: 'WHERE',
      columns: [],
    });
  }

  let groupBy: AggregateClause | undefined;
  if (groupMatch && groupMatch[1]) {
    const cols = groupMatch[1].split(',').map((c) => c.trim());
    groupBy = {
      id: 'group_fallback',
      columns: cols,
      raw: groupMatch[1].trim(),
    };
  }

  const orderBy: SortClause[] = [];
  if (orderMatch && orderMatch[1]) {
    const cols = orderMatch[1].split(',');
    cols.forEach((c, idx) => {
      const parts = c.trim().split(/\s+/);
      orderBy.push({
        id: `order_fallback_${idx}`,
        column: parts[0],
        direction: (parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
      });
    });
  }

  const limit: LimitClause | undefined = limitMatch
    ? { count: parseInt(limitMatch[1], 10) }
    : undefined;

  return {
    id: `fallback_${Date.now()}`,
    rawSql: sql,
    queryType: clean.toUpperCase().startsWith('INSERT')
      ? 'INSERT'
      : clean.toUpperCase().startsWith('UPDATE')
      ? 'UPDATE'
      : clean.toUpperCase().startsWith('DELETE')
      ? 'DELETE'
      : 'SELECT',
    ctes: [],
    sources,
    joins: [],
    filters,
    groupBy,
    having: undefined,
    orderBy,
    limit,
    projections,
    subqueries: [],
    hasStarProjection: hasStar,
    hasCartesianJoin: false,
    hasCorrelatedSubquery: false,
  };
}
