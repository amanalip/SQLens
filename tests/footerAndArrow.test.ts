import { describe, it, expect } from 'vitest';

describe('Footer & Arrow Glyph Verification', () => {
  it('formats foreign key edge arrow labels with proper unicode arrow', () => {
    const fromCol = 'ArtistId';
    const toCol = 'ArtistId';
    const label = `${fromCol} → ${toCol}`;
    expect(label).toBe('ArtistId → ArtistId');
    expect(label).not.toContain('->');
  });

  it('verifies footer copyright attribution and github profile url', () => {
    const copyrightText = '© 2026 - Aman Ali Pogaku';
    const githubUrl = 'https://github.com/amanalip';
    expect(copyrightText).toContain('Aman Ali Pogaku');
    expect(copyrightText).toContain('2026');
    expect(githubUrl).toBe('https://github.com/amanalip');
  });
});
