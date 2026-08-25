import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('DML Mutation Query Parsing and Diagnostics', () => {
  it('parses INSERT statement and extracts target table source', () => {
    const sql = `INSERT INTO artists (name) VALUES ('Miles Davis');`;
    const res = parseSQL(sql);
    expect(res.model.queryType).toBe('INSERT');
    expect(res.model.sources.length).toBe(1);
    expect(res.model.sources[0].name.toLowerCase()).toBe('artists');
  });

  it('parses bounded UPDATE statement and extracts target source', () => {
    const sql = `UPDATE customers SET city = 'Chicago' WHERE customer_id = 101;`;
    const res = parseSQL(sql);
    expect(res.model.queryType).toBe('UPDATE');
    expect(res.model.sources.length).toBe(1);
    expect(res.model.sources[0].name.toLowerCase()).toBe('customers');
    expect(res.diagnostics.length).toBe(0);
  });

  it('flags unbounded UPDATE with require-where-mutation diagnostic', () => {
    const sql = `UPDATE customers SET city = 'Chicago';`;
    const res = parseSQL(sql);
    expect(res.model.queryType).toBe('UPDATE');
    const warning = res.diagnostics.find((d) => d.ruleId === 'require-where-mutation');
    expect(warning).toBeDefined();
    expect(warning?.severity).toBe('warning');
    expect(warning?.suggestion).toContain('WHERE clause');
  });

  it('flags unbounded DELETE with require-where-mutation diagnostic', () => {
    const sql = `DELETE FROM tracks;`;
    const res = parseSQL(sql);
    expect(res.model.queryType).toBe('DELETE');
    const warning = res.diagnostics.find((d) => d.ruleId === 'require-where-mutation');
    expect(warning).toBeDefined();
  });
});
