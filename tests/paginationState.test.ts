import { describe, it, expect } from 'vitest';

function calculatePageCount(totalRows: number, pageSize: number): number {
  if (totalRows <= 0 || pageSize <= 0) return 1;
  return Math.ceil(totalRows / pageSize);
}

function clampPageIndex(targetPage: number, totalPages: number): number {
  if (targetPage < 0) return 0;
  if (targetPage >= totalPages) return Math.max(0, totalPages - 1);
  return targetPage;
}

describe('Pagination State Calculations', () => {
  it('calculates page count correctly across various page sizes', () => {
    expect(calculatePageCount(120, 50)).toBe(3);
    expect(calculatePageCount(50, 50)).toBe(1);
    expect(calculatePageCount(0, 50)).toBe(1);
  });

  it('clamps page index safely within bounds', () => {
    expect(clampPageIndex(-1, 5)).toBe(0);
    expect(clampPageIndex(4, 5)).toBe(4);
    expect(clampPageIndex(10, 5)).toBe(4);
  });
});
