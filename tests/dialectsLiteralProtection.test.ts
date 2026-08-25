import { describe, it, expect } from 'vitest';
import { detectDialect } from '../src/parser/dialects';

describe('Dialect Detection Literal Protection', () => {
  it('does not classify string literals with double colons as PostgreSQL', () => {
    const sql = `SELECT * FROM tracks WHERE url = 'http://api.service.com::8080/v1';`;
    expect(detectDialect(sql)).toBe('sqlite');
  });

  it('does not classify text with ilike in single quotes as PostgreSQL', () => {
    const sql = `SELECT * FROM posts WHERE message = 'I like learning SQL';`;
    expect(detectDialect(sql)).toBe('sqlite');
  });

  it('correctly classifies actual PostgreSQL cast syntax outside literals', () => {
    const sql = `SELECT total::numeric, created_at FROM orders;`;
    expect(detectDialect(sql)).toBe('postgresql');
  });

  it('correctly classifies actual PostgreSQL ILIKE outside literals', () => {
    const sql = `SELECT * FROM users WHERE username ILIKE 'admin%';`;
    expect(detectDialect(sql)).toBe('postgresql');
  });

  it('correctly classifies MySQL backtick identifiers outside literals', () => {
    const sql = 'SELECT `id`, `name` FROM `products`;';
    expect(detectDialect(sql)).toBe('mysql');
  });
});
