import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';
import { buildQueryGraph } from '../src/layout/queryLayout';
import { parseSchemaSQL } from '../src/parser/schemaParser';
import { buildSchemaGraph } from '../src/layout/schemaLayout';

describe('Graph Layout Engines', () => {
  it('generates DAG nodes and sequential flow edges for multi-table join query', () => {
    const sql = `
      SELECT c.name, COUNT(o.id) as order_count
      FROM customers c
      INNER JOIN orders o ON c.id = o.customer_id
      WHERE o.status = 'ACTIVE'
      GROUP BY c.name
      HAVING COUNT(o.id) > 2
      ORDER BY order_count DESC
      LIMIT 5;
    `;
    const { model } = parseSQL(sql);
    const graph = buildQueryGraph(model);

    expect(graph.nodes.some((n) => n.type === 'tableNode')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'joinNode')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'filterNode')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'aggregateNode')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'sortLimitNode')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'outputNode')).toBe(true);
    expect(graph.edges.length).toBeGreaterThan(0);
  });

  it('generates ER diagram nodes and foreign key edges', () => {
    const ddl = `
      CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT);
      CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), title TEXT);
    `;
    const schema = parseSchemaSQL(ddl);
    const schemaGraph = buildSchemaGraph(schema);

    expect(schemaGraph.nodes.length).toBe(2);
    expect(schemaGraph.edges.length).toBe(1);
    expect(schemaGraph.edges[0].source).toBe('table_posts');
    expect(schemaGraph.edges[0].target).toBe('table_users');
  });

  it('connects CTE nodes to downstream source nodes that reference them', () => {
    const sql = `
      WITH active_users AS (
        SELECT id, name FROM users WHERE active = 1
      )
      SELECT a.name, o.total
      FROM active_users a
      JOIN orders o ON a.id = o.user_id;
    `;
    const { model } = parseSQL(sql);
    const graph = buildQueryGraph(model);

    expect(graph.nodes.some((n) => n.type === 'cteNode')).toBe(true);
    const cteEdge = graph.edges.find((e) => e.source === 'cte_0');
    expect(cteEdge).toBeDefined();
    expect(cteEdge?.target).toBe('source_src_0');
  });

  it('renders dual/values node for queries without a FROM clause', () => {
    const sql = 'SELECT 1 + 1 AS result;';
    const { model } = parseSQL(sql);
    const graph = buildQueryGraph(model);

    expect(graph.nodes.some((n) => n.id === 'source_dual')).toBe(true);
    expect(graph.nodes.some((n) => n.type === 'outputNode')).toBe(true);
  });
});
