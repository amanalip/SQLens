import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('Diagnostic Suggestions & Code Navigation Positions', () => {
  it('provides actionable suggestions for wildcard projections', () => {
    const res = parseSQL('SELECT * FROM albums;');
    const starDiag = res.diagnostics.find((d) => d.ruleId === 'no-select-star');
    expect(starDiag).toBeDefined();
    expect(starDiag?.suggestion).toContain('explicitly');
  });

  it('provides actionable suggestions for Cartesian cross joins', () => {
    const res = parseSQL('SELECT a.id, b.id FROM artists a JOIN albums b;');
    const cartDiag = res.diagnostics.find((d) => d.ruleId === 'no-cartesian-join');
    expect(cartDiag).toBeDefined();
    expect(cartDiag?.suggestion).toContain('ON clause');
  });

  it('provides line numbers for invalid syntax errors', () => {
    const res = parseSQL('SELECT FROM WHERE;');
    const errDiag = res.diagnostics.find((d) => d.severity === 'error');
    expect(errDiag).toBeDefined();
    expect(typeof errDiag?.line).toBe('number');
  });
});
