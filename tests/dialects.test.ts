import { describe, it, expect } from 'vitest';
import { detectDialect } from '../src/parser/dialects';

describe('SQL Dialect Detector', () => {
  it('detects PostgreSQL specific constructs', () => {
    expect(detectDialect('SELECT id::text FROM users;')).toBe('postgresql');
    expect(detectDialect('SELECT name FROM items ILIKE "%foo%";')).toBe('postgresql');
    expect(detectDialect('SELECT array_agg(name) FROM items;')).toBe('postgresql');
    expect(detectDialect('SELECT id FROM items RETURNING id;')).toBe('postgresql');
  });

  it('detects MySQL specific constructs', () => {
    expect(detectDialect('SELECT `id`, `name` FROM `users` STRAIGHT_JOIN `orders`;')).toBe('mysql');
    expect(detectDialect('SELECT IFNULL(a, b) FROM data;')).toBe('mysql');
    expect(detectDialect('CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY);')).toBe('mysql');
  });

  it('defaults to SQLite for standard SQL queries and SQLite group_concat', () => {
    expect(detectDialect('SELECT id, name FROM users WHERE id = 1;')).toBe('sqlite');
    expect(detectDialect('SELECT a.id, b.title FROM artists a INNER JOIN albums b ON a.id = b.artist_id;')).toBe('sqlite');
    expect(detectDialect('SELECT group_concat(name) FROM users;')).toBe('sqlite');
  });
});
