import {
  SchemaModel,
  TableSchema,
  ColumnSchema,
  ForeignKeyReference,
  IndexSchema,
} from '../model/schema';

export function parseSchemaSQL(sql: string): SchemaModel {
  const tables: Record<string, TableSchema> = {};
  const foreignKeys: ForeignKeyReference[] = [];

  // Remove comments
  const cleanSql = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Split into statements
  const statements = cleanSql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    // CREATE TABLE matching with optional schema qualification (e.g. public.users)
    const createTableMatch = stmt.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`']?([a-zA-Z0-9_]+)["`']?\.)?["`']?([a-zA-Z0-9_]+)["`']?\s*\(([\s\S]+)\)/i);
    if (createTableMatch) {
      const tableName = createTableMatch[2] || createTableMatch[1];
      const body = createTableMatch[3];
      const table = parseTableDefinition(tableName, body);
      tables[tableName] = table;
      foreignKeys.push(...table.foreignKeys);
      continue;
    }

    // ALTER TABLE ADD CONSTRAINT / FOREIGN KEY matching with optional schema qualification
    const alterFkMatch = stmt.match(/ALTER\s+TABLE\s+(?:["`']?([a-zA-Z0-9_]+)["`']?\.)?["`']?([a-zA-Z0-9_]+)["`']?\s+ADD\s+(?:CONSTRAINT\s+["`']?([a-zA-Z0-9_]+)["`']?\s+)?FOREIGN\s+KEY\s*\(\s*["`']?([a-zA-Z0-9_]+)["`']?\s*\)\s*REFERENCES\s+(?:["`']?([a-zA-Z0-9_]+)["`']?\.)?["`']?([a-zA-Z0-9_]+)["`']?\s*\(\s*["`']?([a-zA-Z0-9_]+)["`']?\s*\)/i);
    if (alterFkMatch) {
      const fromTable = alterFkMatch[2] || alterFkMatch[1];
      const constraintName = alterFkMatch[3];
      const fromCol = alterFkMatch[4];
      const toTable = alterFkMatch[6] || alterFkMatch[5];
      const toCol = alterFkMatch[7];
      const fk: ForeignKeyReference = {
        id: `fk_${fromTable}_${fromCol}_${toTable}_${toCol}`,
        fromTable,
        fromColumn: fromCol,
        toTable,
        toColumn: toCol,
        constraintName,
      };
      foreignKeys.push(fk);
      if (tables[fromTable]) {
        tables[fromTable].foreignKeys.push(fk);
        const col = tables[fromTable].columns.find((c) => c.name.toLowerCase() === fromCol.toLowerCase());
        if (col) {
          col.isForeignKey = true;
          col.references = { table: toTable, column: toCol };
        }
      }
      continue;
    }

    // CREATE [UNIQUE] INDEX matching with optional schema qualification
    const indexMatch = stmt.match(/CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?["`']?([a-zA-Z0-9_]+)["`']?\s+ON\s+(?:["`']?([a-zA-Z0-9_]+)["`']?\.)?["`']?([a-zA-Z0-9_]+)["`']?\s*\(([\s\S]+?)\)/i);
    if (indexMatch) {
      const isUnique = Boolean(indexMatch[1]);
      const indexName = indexMatch[2];
      const indexedTable = indexMatch[4] || indexMatch[3];
      const colList = indexMatch[5]
        .split(',')
        .map((c) => c.trim().replace(/["`']/g, '').split(/\s+/)[0])
        .filter(Boolean);

      if (tables[indexedTable]) {
        tables[indexedTable].indexes.push({
          name: indexName,
          columns: colList,
          isUnique,
        });
      }
    }
  }

  // Detect orphan tables (no incoming or outgoing foreign keys)
  const referencedTables = new Set<string>();
  foreignKeys.forEach((fk) => {
    referencedTables.add(fk.fromTable);
    referencedTables.add(fk.toTable);
  });

  const orphanTables: string[] = Object.keys(tables).filter((t) => !referencedTables.has(t));

  // Detect missing indexes on FK columns
  const missingIndexFkColumns: Array<{ table: string; column: string }> = [];
  foreignKeys.forEach((fk) => {
    const table = tables[fk.fromTable];
    if (table) {
      const hasIndex = table.indexes.some((idx) =>
        idx.columns.some((c) => c.toLowerCase() === fk.fromColumn.toLowerCase())
      );
      const isPk = table.primaryKey.some((pk) => pk.toLowerCase() === fk.fromColumn.toLowerCase());
      if (!hasIndex && !isPk) {
        missingIndexFkColumns.push({
          table: fk.fromTable,
          column: fk.fromColumn,
        });
      }
    }
  });

  return {
    tables,
    foreignKeys,
    orphanTables,
    missingIndexFkColumns,
  };
}

function parseTableDefinition(tableName: string, body: string): TableSchema {
  const columns: ColumnSchema[] = [];
  const primaryKey: string[] = [];
  const foreignKeys: ForeignKeyReference[] = [];
  const indexes: IndexSchema[] = [];

  // Split clauses while taking parentheses into account
  const clauses = splitClauses(body);

  for (const clause of clauses) {
    const trimmed = clause.trim();
    if (!trimmed) continue;

    // Table-level PRIMARY KEY (col1, col2)
    const pkMatch = trimmed.match(/^PRIMARY\s+KEY\s*\(([\s\S]+)\)/i);
    if (pkMatch) {
      const pks = pkMatch[1]
        .split(',')
        .map((p) => p.trim().replace(/["`']/g, ''));
      primaryKey.push(...pks);
      continue;
    }

    // Table-level FOREIGN KEY (col) REFERENCES other(col)
    const fkMatch = trimmed.match(/^(?:CONSTRAINT\s+["`']?([a-zA-Z0-9_]+)["`']?\s+)?FOREIGN\s+KEY\s*\(\s*["`']?([a-zA-Z0-9_]+)["`']?\s*\)\s*REFERENCES\s+["`']?([a-zA-Z0-9_]+)["`']?\s*\(\s*["`']?([a-zA-Z0-9_]+)["`']?\s*\)/i);
    if (fkMatch) {
      const [, constraintName, fromCol, toTable, toCol] = fkMatch;
      foreignKeys.push({
        id: `fk_${tableName}_${fromCol}_${toTable}_${toCol}`,
        fromTable: tableName,
        fromColumn: fromCol,
        toTable,
        toColumn: toCol,
        constraintName,
      });
      continue;
    }

    // Table-level UNIQUE (col1, col2)
    const uniqueMatch = trimmed.match(/^UNIQUE\s*(?:\s+["`']?([a-zA-Z0-9_]+)["`']?\s*)?\(([\s\S]+)\)/i);
    if (uniqueMatch) {
      const name = uniqueMatch[1] || `uniq_${tableName}_${Date.now()}`;
      const cols = uniqueMatch[2]
        .split(',')
        .map((c) => c.trim().replace(/["`']/g, ''));
      indexes.push({ name, columns: cols, isUnique: true });
      continue;
    }

    // Column definition
    const colNameMatch = trimmed.match(/^["`']?([a-zA-Z0-9_]+)["`']?\s+([\s\S]+)$/);
    if (colNameMatch) {
      const colName = colNameMatch[1];
      const rest = colNameMatch[2].trim();

      // Separate type from constraints
      const constraintKeywords = /\b(PRIMARY\s+KEY|NOT\s+NULL|NULL|UNIQUE|DEFAULT|REFERENCES|CHECK|AUTO_INCREMENT|COLLATE|GENERATED)\b/i;
      const constraintIdx = rest.search(constraintKeywords);

      let colType = '';
      let constraints = '';

      if (constraintIdx !== -1) {
        colType = rest.substring(0, constraintIdx).trim();
        constraints = rest.substring(constraintIdx).trim();
      } else {
        colType = rest;
        constraints = '';
      }

      const isPk = /PRIMARY\s+KEY/i.test(constraints);
      const isNotNull = /NOT\s+NULL/i.test(constraints) || isPk;
      const isUnique = /UNIQUE/i.test(constraints);

      // Inline REFERENCES target_table(target_col)
      const inlineRef = constraints.match(/REFERENCES\s+["`']?([a-zA-Z0-9_]+)["`']?\s*(?:\(\s*["`']?([a-zA-Z0-9_]+)["`']?\s*\))?/i);
      let refObj: { table: string; column: string } | undefined;

      if (inlineRef) {
        const targetTable = inlineRef[1];
        const targetCol = inlineRef[2] || 'id';
        refObj = { table: targetTable, column: targetCol };
        foreignKeys.push({
          id: `fk_${tableName}_${colName}_${targetTable}_${targetCol}`,
          fromTable: tableName,
          fromColumn: colName,
          toTable: targetTable,
          toColumn: targetCol,
        });
      }

      if (isPk) {
        primaryKey.push(colName);
      }

      columns.push({
        name: colName,
        type: colType.toUpperCase() || 'TEXT',
        nullable: !isNotNull,
        isPrimaryKey: isPk,
        isForeignKey: Boolean(inlineRef),
        isUnique,
        references: refObj,
      });
    }
  }

  // Update columns if table-level PK marked them
  primaryKey.forEach((pk) => {
    const col = columns.find((c) => c.name.toLowerCase() === pk.toLowerCase());
    if (col) {
      col.isPrimaryKey = true;
      col.nullable = false;
    }
  });

  // Update columns if table-level FK marked them
  foreignKeys.forEach((fk) => {
    const col = columns.find((c) => c.name.toLowerCase() === fk.fromColumn.toLowerCase());
    if (col) {
      col.isForeignKey = true;
      col.references = { table: fk.toTable, column: fk.toColumn };
    }
  });

  return {
    name: tableName,
    columns,
    primaryKey,
    foreignKeys,
    indexes,
  };
}

function splitClauses(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '(' && !inSingleQuote && !inDoubleQuote) {
      depth++;
    } else if (char === ')' && !inSingleQuote && !inDoubleQuote) {
      depth--;
    } else if (char === ',' && depth === 0 && !inSingleQuote && !inDoubleQuote) {
      result.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) {
    result.push(current);
  }

  return result;
}
