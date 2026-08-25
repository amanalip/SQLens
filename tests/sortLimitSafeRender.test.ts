import { describe, it, expect } from 'vitest';
import { SortClause, LimitClause } from '../src/model/query';

function renderSortText(orderBy?: SortClause[]): string {
  if (!orderBy || orderBy.length === 0) return 'Natural order';
  return orderBy.map((o) => `${o.column} ${o.direction}`).join(', ');
}

function renderLimitText(limit?: LimitClause): string {
  if (!limit) return 'No limit';
  return `LIMIT ${limit.count}${limit.offset !== undefined ? ` OFFSET ${limit.offset}` : ''}`;
}

describe('Sort & Limit Node Rendering', () => {
  it('renders sort direction and column list', () => {
    const sorts: SortClause[] = [
      { id: 's1', column: 'created_at', direction: 'DESC' },
      { id: 's2', column: 'id', direction: 'ASC' },
    ];
    expect(renderSortText(sorts)).toBe('created_at DESC, id ASC');
  });

  it('renders limit and offset values', () => {
    expect(renderLimitText({ count: 10, offset: 20 })).toBe('LIMIT 10 OFFSET 20');
    expect(renderLimitText({ count: 50 })).toBe('LIMIT 50');
    expect(renderLimitText(undefined)).toBe('No limit');
  });
});
