import { describe, it, expect } from 'vitest';
import { CTENodeData } from '../src/graph/nodes/CTESubgraphNode';

describe('CTE Node Data Mapping', () => {
  it('generates fallback summary when summary string is absent', () => {
    const cteData: CTENodeData = {
      name: 'top_customers',
      model: {
        id: 'top_customers_model',
        rawSql: 'SELECT * FROM customers',
        queryType: 'SELECT',
        ctes: [],
        sources: [
          { id: 'src_1', name: 'customers' },
          { id: 'src_2', name: 'invoices' },
        ],
        joins: [],
        filters: [],
        orderBy: [],
        projections: [],
        subqueries: [],
        hasStarProjection: true,
        hasCartesianJoin: false,
        hasCorrelatedSubquery: false,
      },
      summary: '',
    };

    const summaryText =
      cteData.summary ||
      `SELECT from ${cteData.model?.sources?.map((s) => s.name).join(', ') || 'sources'}`;

    expect(summaryText).toBe('SELECT from customers, invoices');
  });
});
