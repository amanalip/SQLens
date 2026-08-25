import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';
import { buildQueryGraph } from '../src/layout/queryLayout';

describe('Subquery Graph Layout Generation', () => {
  it('generates subquery nodes and connecting edges for WHERE subqueries', () => {
    const sql = `SELECT track_id, name, milliseconds FROM tracks WHERE milliseconds > (SELECT AVG(milliseconds) FROM tracks);`;
    const res = parseSQL(sql);
    expect(res.model.subqueries.length).toBeGreaterThan(0);

    const graph = buildQueryGraph(res.model);
    const subqueryNodes = graph.nodes.filter((n) => n.id.startsWith('subquery_where_'));
    expect(subqueryNodes.length).toBeGreaterThan(0);

    const filterNode = graph.nodes.find((n) => n.id === 'filter_where');
    expect(filterNode).toBeDefined();

    const subqueryEdges = graph.edges.filter((e) => e.source.startsWith('subquery_where_') && e.target === 'filter_where');
    expect(subqueryEdges.length).toBeGreaterThan(0);
  });

  it('correctly handles queries without subqueries without adding orphan subquery nodes', () => {
    const sql = `SELECT id, name FROM artists WHERE id > 10;`;
    const res = parseSQL(sql);
    const graph = buildQueryGraph(res.model);
    const subqueryNodes = graph.nodes.filter((n) => n.id.startsWith('subquery_where_'));
    expect(subqueryNodes.length).toBe(0);
  });
});
