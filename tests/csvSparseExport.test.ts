import { describe, it, expect } from 'vitest';

function generateCsvSafe(result: { columns?: string[]; values?: unknown[][] } | null): string {
  if (!result || !Array.isArray(result.columns) || result.columns.length === 0) return '';
  const header = result.columns.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',');
  const valuesList = Array.isArray(result.values) ? result.values : [];
  const rows = valuesList
    .map((row) =>
      (Array.isArray(row) ? row : [])
        .map((cell) => {
          if (cell === null || cell === undefined) return '';
          if (typeof cell === 'number') return String(cell);
          if (typeof cell === 'boolean') return cell ? 'TRUE' : 'FALSE';
          if (typeof cell === 'object') {
            try {
              return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
            } catch {
              return '""';
            }
          }
          const cellStr = String(cell).replace(/"/g, '""');
          return `"${cellStr}"`;
        })
        .join(',')
    )
    .join('\n');
  return `${header}\n${rows}`;
}

describe('CSV Sparse Export Generation', () => {
  it('handles empty result or missing columns cleanly', () => {
    expect(generateCsvSafe(null)).toBe('');
    expect(generateCsvSafe({ columns: [] })).toBe('');
  });

  it('handles missing or undefined values array gracefully', () => {
    const csv = generateCsvSafe({ columns: ['id', 'status'] });
    expect(csv).toBe('"id","status"\n');
  });

  it('formats sparse rows with missing cells correctly', () => {
    const csv = generateCsvSafe({
      columns: ['id', 'details'],
      values: [[1, null], [2, { active: true }]],
    });
    expect(csv).toBe('"id","details"\n1,\n2,"{""active"":true}"');
  });
});
