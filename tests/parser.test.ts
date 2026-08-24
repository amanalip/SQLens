import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';
import { exprToString } from '../src/parser/queryAnalyzer';

describe('SQL Parser & Analyzer', () => {
  it('parses simple SELECT statement', () => {
    const sql = 'SELECT id, name FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10;';
    const result = parseSQL(sql);

    expect(result.model.sources.length).toBe(1);
    expect(result.model.sources[0].name).toBe('users');
    expect(result.model.projections.length).toBe(2);
    expect(result.model.filters.length).toBe(1);
    expect(result.model.orderBy.length).toBe(1);
    expect(result.model.limit?.count).toBe(10);
    expect(result.diagnostics.some((d) => d.id === 'star-projection')).toBe(false);
  });

  it('detects SELECT * and creates warning', () => {
    const sql = 'SELECT * FROM customers;';
    const result = parseSQL(sql);

    expect(result.model.hasStarProjection).toBe(true);
    expect(result.diagnostics.some((d) => d.id === 'star-projection')).toBe(true);
  });

  it('parses multi-table JOINs correctly', () => {
    const sql = `
      SELECT o.id, c.name, p.title
      FROM orders o
      INNER JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.status = 'COMPLETED';
    `;
    const result = parseSQL(sql);

    expect(result.model.sources.length).toBe(3);
    expect(result.model.joins.length).toBe(2);
    expect(result.model.joins[0].type).toBe('INNER');
    expect(result.model.joins[1].type).toBe('LEFT');
    expect(result.model.filters.length).toBe(1);
  });

  it('parses GROUP BY and HAVING clauses', () => {
    const sql = `
      SELECT department, COUNT(id) as total_employees, AVG(salary) as avg_sal
      FROM employees
      GROUP BY department
      HAVING COUNT(id) > 5;
    `;
    const result = parseSQL(sql);

    expect(result.model.groupBy).toBeDefined();
    expect(result.model.groupBy?.columns).toContain('department');
    expect(result.model.having).toBeDefined();
  });

  it('parses Common Table Expressions (WITH clause)', () => {
    const sql = `
      WITH high_earners AS (
        SELECT id, name, salary FROM employees WHERE salary > 100000
      )
      SELECT name, salary FROM high_earners;
    `;
    const result = parseSQL(sql);

    expect(result.model.ctes.length).toBe(1);
    expect(result.model.ctes[0].name).toBe('high_earners');
    expect(result.model.ctes[0].model.sources[0].name).toBe('employees');
  });

  it('handles empty SQL query cleanly', () => {
    const result = parseSQL('');
    expect(result.model.sources.length).toBe(0);
    expect(result.diagnostics.length).toBe(0);
  });

  it('handles SQL comments cleanly', () => {
    const sql = `
      -- Single line comment
      /* Multi-line
         comment */
      SELECT id FROM users;
    `;
    const result = parseSQL(sql);
    expect(result.model.sources.length).toBe(1);
    expect(result.model.sources[0].name).toBe('users');
  });

  it('parses multiple chained CTEs', () => {
    const sql = `
      WITH cte1 AS (
        SELECT id, user_id FROM orders
      ),
      cte2 AS (
        SELECT id FROM cte1 WHERE user_id > 10
      )
      SELECT * FROM cte2;
    `;
    const result = parseSQL(sql);
    expect(result.model.ctes.length).toBe(2);
    expect(result.model.ctes[0].name).toBe('cte1');
    expect(result.model.ctes[1].name).toBe('cte2');
  });

  it('parses JOIN with USING clause correctly', () => {
    const sql = 'SELECT * FROM orders JOIN customers USING (customer_id);';
    const result = parseSQL(sql);
    expect(result.model.joins.length).toBe(1);
    expect(result.model.joins[0].usingColumns).toContain('customer_id');
  });

  it('safely stringifies circular AST nodes without throwing', () => {
    const circularObj: Record<string, unknown> = { type: 'custom_unknown' };
    circularObj.self = circularObj;
    expect(() => exprToString(circularObj)).not.toThrow();
  });
});
