import { Parser } from 'node-sql-parser';
import { SQLDialect, detectDialect } from './dialects';
import { DiagnosticWarning } from '../model/diagnostics';
import { QueryModel } from '../model/query';
import { analyzeAst, analyzeWithFallback } from './queryAnalyzer';

const parser = new Parser();

export interface ParseResult {
  model: QueryModel;
  ast: unknown;
  diagnostics: DiagnosticWarning[];
  dialect: SQLDialect;
}

export function parseSQL(sql: string, userDialect?: SQLDialect): ParseResult {
  const trimmed = sql.trim();
  const dialect = userDialect || detectDialect(trimmed);
  const diagnostics: DiagnosticWarning[] = [];

  if (!trimmed) {
    return {
      model: {
        id: 'empty',
        rawSql: '',
        queryType: 'UNKNOWN',
        ctes: [],
        sources: [],
        joins: [],
        filters: [],
        orderBy: [],
        projections: [],
        subqueries: [],
        hasStarProjection: false,
        hasCartesianJoin: false,
        hasCorrelatedSubquery: false,
      },
      ast: null,
      diagnostics: [],
      dialect,
    };
  }

  // Dialect mapping for node-sql-parser
  const dbType = dialect === 'postgresql' ? 'postgresql' : dialect === 'mysql' ? 'mysql' : 'sqlite';

  try {
    const ast = parser.astify(trimmed, { database: dbType });
    const singleAst = Array.isArray(ast) ? ast[0] : ast;
    const model = analyzeAst(singleAst, trimmed);

    // Diagnostics checks
    if ((model.queryType === 'DELETE' || model.queryType === 'UPDATE') && model.filters.length === 0) {
      diagnostics.push({
        id: 'unbounded-mutation',
        message: `${model.queryType} statement lacks a WHERE clause and will affect every row in the table.`,
        severity: 'warning',
        ruleId: 'require-where-mutation',
        suggestion: 'Add a WHERE clause to constrain the target rows',
      });
    }

    if (model.hasStarProjection) {
      diagnostics.push({
        id: 'star-projection',
        message: 'SELECT * used. Specifying explicit column names improves query predictability.',
        severity: 'info',
        ruleId: 'no-select-star',
        suggestion: 'Specify required column names explicitly',
      });
    }

    if (model.hasCartesianJoin) {
      diagnostics.push({
        id: 'cartesian-join',
        message: 'Cartesian join detected (table join without ON or USING condition).',
        severity: 'warning',
        ruleId: 'no-cartesian-join',
        suggestion: 'Add an ON clause or use explicit join criteria',
      });
    }

    if (model.hasCorrelatedSubquery) {
      diagnostics.push({
        id: 'correlated-subquery',
        message: 'Correlated subquery found. This may execute once per outer row.',
        severity: 'info',
        ruleId: 'correlated-subquery',
      });
    }

    if (/LIKE\s+['"]%[^'"]+['"]/i.test(trimmed)) {
      diagnostics.push({
        id: 'leading-wildcard-like',
        message: 'Leading wildcard in LIKE clause (%...) prevents index lookups and causes full table scans.',
        severity: 'info',
        ruleId: 'no-leading-wildcard',
        suggestion: 'Consider full-text search or prefix matching if performance is critical',
      });
    }

    return {
      model,
      ast: singleAst,
      diagnostics,
      dialect,
    };
  } catch (err: unknown) {
    const error = err as { message?: string; location?: { start?: { line?: number; column?: number } } };
    const line = error.location?.start?.line;
    const column = error.location?.start?.column;
    const message = error.message || 'Syntax error encountered while parsing query.';

    diagnostics.push({
      id: 'syntax-error',
      message: message.replace(/Expected.*$/s, (m) => m.substring(0, 120)),
      severity: 'error',
      line,
      column,
      ruleId: 'syntax-validity',
    });

    // Graceful fallback parser
    const fallbackModel = analyzeWithFallback(trimmed);

    return {
      model: fallbackModel,
      ast: null,
      diagnostics,
      dialect,
    };
  }
}
