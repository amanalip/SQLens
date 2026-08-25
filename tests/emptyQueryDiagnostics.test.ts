import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('Empty Query Diagnostic Handling', () => {
  it('returns empty model structure with 0 diagnostics for empty strings', () => {
    const result = parseSQL('');
    expect(result.model.id).toBe('empty');
    expect(result.model.sources).toEqual([]);
    expect(result.model.filters).toEqual([]);
    expect(result.diagnostics).toHaveLength(0);
  });

  it('returns empty model structure with 0 diagnostics for whitespace strings', () => {
    const result = parseSQL('   \t\n  ');
    expect(result.model.id).toBe('empty');
    expect(result.diagnostics).toHaveLength(0);
  });
});
