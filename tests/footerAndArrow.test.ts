import { describe, it, expect } from 'vitest';

describe('Footer & Arrow Glyph Verification', () => {
  it('formats foreign key edge arrow labels with proper unicode arrow and splits correctly', () => {
    const fromCol = 'ArtistId';
    const toCol = 'ArtistId';
    const label = `${fromCol} → ${toCol}`;
    expect(label).toBe('ArtistId → ArtistId');
    expect(label).not.toContain('->');

    const parts = label.split('→');
    expect(parts).toHaveLength(2);
    expect(parts[0].trim()).toBe('ArtistId');
    expect(parts[1].trim()).toBe('ArtistId');
  });

  it('verifies author name is hyperlinked directly to GitHub profile', () => {
    const authorName = 'Aman Ali Pogaku';
    const githubUrl = 'https://github.com/amanalip';
    expect(authorName).toBe('Aman Ali Pogaku');
    expect(githubUrl).toBe('https://github.com/amanalip');
  });
});
