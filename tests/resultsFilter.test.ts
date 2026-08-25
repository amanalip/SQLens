import { describe, it, expect } from 'vitest';

function filterResults(rows: Record<string, unknown>[], searchTerm: string): Record<string, unknown>[] {
  if (!searchTerm.trim()) return rows;
  const q = searchTerm.toLowerCase();
  return rows.filter((row) =>
    Object.values(row).some((val) =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(q)
    )
  );
}

describe('In-Memory Results Table Filter', () => {
  const sampleData: Record<string, unknown>[] = [
    { id: 1, name: 'Alice', role: 'Admin', score: 95, active: true },
    { id: 2, name: 'Bob', role: 'Developer', score: 88, active: false },
    { id: 3, name: 'Charlie', role: 'Designer', score: null, active: true },
    { id: 4, name: 'Dave', role: 'Developer', score: 72, active: true },
  ];

  it('returns all rows when search query is empty or whitespace', () => {
    expect(filterResults(sampleData, '')).toHaveLength(4);
    expect(filterResults(sampleData, '   ')).toHaveLength(4);
  });

  it('filters rows matching text across any column case-insensitively', () => {
    const result = filterResults(sampleData, 'developer');
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.name)).toEqual(['Bob', 'Dave']);
  });

  it('filters by numeric values', () => {
    const result = filterResults(sampleData, '95');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('filters by boolean string representations', () => {
    const result = filterResults(sampleData, 'false');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob');
  });

  it('handles null and undefined values safely without crashing', () => {
    const result = filterResults(sampleData, 'charlie');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Charlie');
  });
});
