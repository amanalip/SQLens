import { describe, it, expect } from 'vitest';
import { QueryModel } from '../src/model/query';

function formatCteProjections(model: Partial<QueryModel>): string {
  if (!model.projections || model.projections.length === 0) return '*';
  return model.projections
    .map((p) => p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*')
    .join('\n');
}

describe('CTE Inspector Details Formatting', () => {
  it('formats explicit CTE column projections with aliases', () => {
    const model: Partial<QueryModel> = {
      projections: [
        { id: 'proj_1', raw: 'customer_id', expr: 'customer_id' },
        { id: 'proj_2', raw: '', expr: 'SUM(total)', alias: 'total_spent' },
      ],
    };
    expect(formatCteProjections(model)).toBe('customer_id\nSUM(total) AS total_spent');
  });

  it('falls back to wildcard when projections are omitted', () => {
    expect(formatCteProjections({})).toBe('*');
  });
});
