import { describe, it, expect } from 'vitest';

function formatCsv(columns: string[], values: unknown[][]): string {
  if (columns.length === 0) return '';
  const header = columns.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',');
  const rows = values
    .map((row) =>
      row
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

describe('CSV Formatter Unit Tests', () => {
  it('formats headers and primitive values correctly', () => {
    const cols = ['id', 'name', 'price', 'in_stock'];
    const rows = [
      [1, 'Apples', 2.99, true],
      [2, 'Bananas', 1.49, false],
    ];

    const csv = formatCsv(cols, rows);
    expect(csv).toContain('"id","name","price","in_stock"');
    expect(csv).toContain('1,"Apples",2.99,TRUE');
    expect(csv).toContain('2,"Bananas",1.49,FALSE');
  });

  it('escapes quotes in strings properly', () => {
    const cols = ['title', 'quote'];
    const rows = [['Movie', 'He said "Hello"']];

    const csv = formatCsv(cols, rows);
    expect(csv).toContain('"He said ""Hello"""');
  });

  it('serializes null and undefined cells as empty strings', () => {
    const cols = ['id', 'description'];
    const rows = [[1, null], [2, undefined]];

    const csv = formatCsv(cols, rows);
    expect(csv).toContain('1,\n2,');
  });
});
