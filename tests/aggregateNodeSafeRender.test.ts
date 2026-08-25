import { describe, it, expect } from 'vitest';

function renderAggregateText(raw?: string, columns?: string[]): string {
  return raw || (columns && columns.length > 0 ? columns.join(', ') : 'ALL');
}

describe('Aggregate Node Group By Formatting', () => {
  it('prefers raw string expression if available', () => {
    expect(renderAggregateText('department_id, strftime("%Y", hire_date)', ['department_id'])).toBe(
      'department_id, strftime("%Y", hire_date)'
    );
  });

  it('formats column array when raw is absent', () => {
    expect(renderAggregateText('', ['country', 'city'])).toBe('country, city');
  });

  it('falls back to ALL for total aggregation', () => {
    expect(renderAggregateText('', [])).toBe('ALL');
  });
});
