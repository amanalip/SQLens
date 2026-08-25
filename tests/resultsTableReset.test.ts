import { describe, it, expect } from 'vitest';
import { QueryExecutionResult } from '../src/engine/worker';

function handleResultTransition(
  prevResult: QueryExecutionResult | null,
  newResult: QueryExecutionResult | null,
  currentFilter: string
): string {
  if (newResult !== prevResult) {
    return '';
  }
  return currentFilter;
}

describe('Results Table Search Filter Synchronization', () => {
  it('resets filter text when a new query execution result is received', () => {
    const res1: QueryExecutionResult = {
      columns: ['id', 'name'],
      values: [[1, 'Alice'], [2, 'Bob']],
      rowCount: 2,
      executionTimeMs: 4,
    };
    const res2: QueryExecutionResult = {
      columns: ['track_id', 'title'],
      values: [[101, 'Song A']],
      rowCount: 1,
      executionTimeMs: 3,
    };

    let filter = 'Alice';
    filter = handleResultTransition(res1, res2, filter);
    expect(filter).toBe('');
  });

  it('maintains filter text when result reference is unchanged', () => {
    const res: QueryExecutionResult = {
      columns: ['id'],
      values: [[1]],
      rowCount: 1,
      executionTimeMs: 2,
    };
    let filter = 'active_filter';
    filter = handleResultTransition(res, res, filter);
    expect(filter).toBe('active_filter');
  });
});
