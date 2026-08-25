import { describe, it, expect } from 'vitest';
import { parseSchemaSQL } from '../src/parser/schemaParser';

describe('Schema DDL Default Value Parsing', () => {
  it('extracts numeric and string DEFAULT values', () => {
    const ddl = `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        price REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active' NOT NULL
      );
    `;
    const schema = parseSchemaSQL(ddl);
    expect(schema.tables.products).toBeDefined();

    const priceCol = schema.tables.products.columns.find((c) => c.name === 'price');
    expect(priceCol?.defaultValue).toBe('0.0');

    const statusCol = schema.tables.products.columns.find((c) => c.name === 'status');
    expect(statusCol?.defaultValue).toBe("'active'");
  });

  it('extracts timestamp DEFAULT values', () => {
    const ddl = `
      CREATE TABLE audit_logs (
        id INTEGER PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const schema = parseSchemaSQL(ddl);
    const createdAtCol = schema.tables.audit_logs.columns.find((c) => c.name === 'created_at');
    expect(createdAtCol?.defaultValue).toBe('CURRENT_TIMESTAMP');
  });
});
