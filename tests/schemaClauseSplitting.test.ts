import { describe, it, expect } from 'vitest';
import { parseSchemaSQL } from '../src/parser/schemaParser';

describe('Schema DDL Clause Splitting with Complex Columns', () => {
  it('handles check constraints containing commas and parentheses', () => {
    const ddl = `
      CREATE TABLE accounts (
        id INTEGER PRIMARY KEY,
        balance NUMERIC(10, 2) DEFAULT 0.00,
        status TEXT CHECK (status IN ('active', 'pending', 'suspended'))
      );
    `;
    const schema = parseSchemaSQL(ddl);
    expect(schema.tables.accounts).toBeDefined();
    expect(schema.tables.accounts.columns).toHaveLength(3);

    const balanceCol = schema.tables.accounts.columns.find((c) => c.name === 'balance');
    expect(balanceCol?.type).toBe('NUMERIC(10, 2)');
  });
});
