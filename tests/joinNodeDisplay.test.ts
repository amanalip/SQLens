import { describe, it, expect } from 'vitest';

function getJoinSummary(data: {
  onCondition?: string;
  usingColumns?: string[];
}): string {
  if (data.onCondition) return `ON ${data.onCondition}`;
  if (data.usingColumns && data.usingColumns.length > 0) return `USING (${data.usingColumns.join(', ')})`;
  return 'Cartesian product';
}

describe('Join Node Summary Formatting', () => {
  it('formats ON conditions correctly', () => {
    expect(getJoinSummary({ onCondition: 'orders.user_id = users.id' })).toBe('ON orders.user_id = users.id');
  });

  it('formats USING clauses correctly', () => {
    expect(getJoinSummary({ usingColumns: ['user_id', 'org_id'] })).toBe('USING (user_id, org_id)');
  });

  it('identifies Cartesian product when no condition exists', () => {
    expect(getJoinSummary({})).toBe('Cartesian product');
  });
});
