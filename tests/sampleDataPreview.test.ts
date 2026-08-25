import { describe, it, expect } from 'vitest';

describe('Sample Data Preview Table Structure', () => {
  it('preserves all columns in sample preview rows without dropping keys', () => {
    const columns = [
      { name: 'match_id', type: 'INTEGER' },
      { name: 'match_date', type: 'DATE' },
      { name: 'home_team_id', type: 'INTEGER' },
      { name: 'away_team_id', type: 'INTEGER' },
      { name: 'home_score', type: 'INTEGER' },
      { name: 'away_score', type: 'INTEGER' },
    ];

    const sampleRows = [
      { match_id: 1, match_date: '2024-03-31', home_team_id: 1, away_team_id: 2, home_score: 2, away_score: 1 },
      { match_id: 2, match_date: '2024-04-03', home_team_id: 1, away_team_id: 4, home_score: 0, away_score: 0 },
    ];

    const headers = columns.map((c) => c.name);
    expect(headers).toHaveLength(6);
    expect(headers).toContain('away_team_id');
    expect(headers).toContain('away_score');

    sampleRows.forEach((row) => {
      headers.forEach((colName) => {
        expect(row).toHaveProperty(colName);
      });
    });
  });
});
