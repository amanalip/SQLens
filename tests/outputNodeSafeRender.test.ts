import { describe, it, expect } from 'vitest';
import { Projection } from '../src/model/query';

function renderProjectionsText(projections?: Projection[]): string {
  if (!projections || projections.length === 0) return '*';
  return projections
    .map((p) => p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*')
    .join('\n');
}

describe('Output Node Projection Rendering', () => {
  it('renders explicit projections and aliases', () => {
    const projections: Projection[] = [
      { id: 'p1', raw: 'id', expr: 'id' },
      { id: 'p2', raw: '', expr: 'COUNT(*)', alias: 'total_count' },
    ];
    expect(renderProjectionsText(projections)).toBe('id\nCOUNT(*) AS total_count');
  });

  it('renders wildcard when projections array is undefined or empty', () => {
    expect(renderProjectionsText(undefined)).toBe('*');
    expect(renderProjectionsText([])).toBe('*');
  });
});
