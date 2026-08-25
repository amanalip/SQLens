import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('Comment-Only SQL Query Parsing', () => {
  it('parses single-line comments without syntax errors or diagnostics', () => {
    const sql = `-- This is a note about the customer table\n-- Another note line`;
    const result = parseSQL(sql);
    expect(result.model.queryType).toBe('UNKNOWN');
    expect(result.diagnostics).toHaveLength(0);
    expect(result.ast).toBeNull();
  });

  it('parses multi-line block comments without syntax errors or diagnostics', () => {
    const sql = `/*\n * Detailed documentation block\n * Author: Database Engineer\n */`;
    const result = parseSQL(sql);
    expect(result.model.queryType).toBe('UNKNOWN');
    expect(result.diagnostics).toHaveLength(0);
    expect(result.ast).toBeNull();
  });

  it('parses mixed comments and trailing whitespace cleanly', () => {
    const sql = `-- initial comment\n/* inline comment */\n\t  `;
    const result = parseSQL(sql);
    expect(result.model.queryType).toBe('UNKNOWN');
    expect(result.diagnostics).toHaveLength(0);
  });
});
