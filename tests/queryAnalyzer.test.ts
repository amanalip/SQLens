import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('Query Analyzer AST Extraction', () => {
  it('analyzes Common Table Expressions (CTEs)', () => {
    const sql = `
      WITH regional_sales AS (
        SELECT region, SUM(amount) AS total_sales
        FROM orders
        GROUP BY region
      )
      SELECT region, total_sales
      FROM regional_sales
      WHERE total_sales > 10000;
    `;
    const res = parseSQL(sql);
    expect(res.model.ctes.length).toBe(1);
    expect(res.model.ctes[0].name).toBe('regional_sales');
    expect(res.model.sources[0].name).toBe('regional_sales');
    expect(res.model.filters.length).toBe(1);
  });

  it('analyzes multiple JOIN types correctly', () => {
    const sql = `
      SELECT o.order_id, c.customer_name, e.first_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      INNER JOIN employees e ON o.employee_id = e.employee_id;
    `;
    const res = parseSQL(sql);
    expect(res.model.sources.length).toBe(3);
    expect(res.model.joins.length).toBe(2);
    expect(res.model.joins[0].type).toBe('LEFT');
    expect(res.model.joins[1].type).toBe('INNER');
  });

  it('analyzes GROUP BY, HAVING, and aggregations', () => {
    const sql = `
      SELECT category_id, COUNT(product_id) AS items, AVG(unit_price) AS avg_price
      FROM products
      GROUP BY category_id
      HAVING COUNT(product_id) >= 5;
    `;
    const res = parseSQL(sql);
    expect(res.model.groupBy).toBeDefined();
    expect(res.model.having).toBeDefined();
    expect(res.model.projections.length).toBe(3);
  });

  it('analyzes ORDER BY and LIMIT clauses', () => {
    const sql = `
      SELECT id, name, score
      FROM players
      ORDER BY score DESC, name ASC
      LIMIT 25 OFFSET 50;
    `;
    const res = parseSQL(sql);
    expect(res.model.orderBy.length).toBe(2);
    expect(res.model.orderBy[0].direction).toBe('DESC');
    expect(res.model.orderBy[1].direction).toBe('ASC');
    expect(res.model.limit?.count).toBe(25);
    expect(res.model.limit?.offset).toBe(50);
  });

  it('handles fallback parser for unparseable or complex queries', () => {
    const sql = 'SELECT id, username FROM users WHERE status = 1 ORDER BY id DESC LIMIT 10';
    const res = parseSQL(sql);
    expect(res.model.sources[0].name).toBe('users');
    expect(res.model.projections.length).toBe(2);
    expect(res.model.limit?.count).toBe(10);
  });
});
