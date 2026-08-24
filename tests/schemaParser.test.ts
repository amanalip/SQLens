import { describe, it, expect } from 'vitest';
import { parseSchemaSQL } from '../src/parser/schemaParser';

describe('Schema DDL Parser', () => {
  it('parses CREATE TABLE statements with primary and foreign keys', () => {
    const ddl = `
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        dept_id INTEGER,
        FOREIGN KEY (dept_id) REFERENCES departments(id)
      );

      CREATE TABLE audit_logs (
        id INTEGER PRIMARY KEY,
        action TEXT
      );
    `;

    const schema = parseSchemaSQL(ddl);

    expect(Object.keys(schema.tables).length).toBe(3);
    expect(schema.tables['departments'].columns.length).toBe(2);
    expect(schema.tables['employees'].columns.find((c) => c.name === 'dept_id')?.isForeignKey).toBe(true);
    expect(schema.foreignKeys.length).toBe(1);
    expect(schema.foreignKeys[0].fromTable).toBe('employees');
    expect(schema.foreignKeys[0].toTable).toBe('departments');
    expect(schema.orphanTables).toContain('audit_logs');
  });

  it('detects inline REFERENCES and missing indexes on foreign key columns', () => {
    const ddl = `
      CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT
      );

      CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author_id INTEGER REFERENCES authors(id)
      );
    `;

    const schema = parseSchemaSQL(ddl);

    expect(schema.foreignKeys.length).toBe(1);
    expect(schema.foreignKeys[0].fromColumn).toBe('author_id');
    expect(schema.missingIndexFkColumns.length).toBe(1);
    expect(schema.missingIndexFkColumns[0]).toEqual({ table: 'books', column: 'author_id' });
  });

  it('parses multi-word data types and composite primary keys', () => {
    const ddl = `
      CREATE TABLE financial_metrics (
        company_id INTEGER NOT NULL,
        metric_date TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        shares INT UNSIGNED DEFAULT 0,
        notes CHARACTER VARYING(500),
        PRIMARY KEY (company_id, metric_date)
      );
      CREATE INDEX idx_metrics_date ON financial_metrics (metric_date);
    `;

    const schema = parseSchemaSQL(ddl);
    const table = schema.tables['financial_metrics'];

    expect(table).toBeDefined();
    expect(table.primaryKey).toEqual(['company_id', 'metric_date']);
    expect(table.columns.find((c) => c.name === 'price')?.type).toBe('DOUBLE PRECISION');
    expect(table.columns.find((c) => c.name === 'shares')?.type).toBe('INT UNSIGNED');
    expect(table.indexes.length).toBe(1);
    expect(table.indexes[0].name).toBe('idx_metrics_date');
  });

  it('parses schema-qualified table names in CREATE TABLE, ALTER TABLE, and CREATE INDEX', () => {
    const ddl = `
      CREATE TABLE "public"."customers" (
        id INT PRIMARY KEY,
        email TEXT NOT NULL
      );
      CREATE TABLE public.orders (
        id INT PRIMARY KEY,
        customer_id INT
      );
      ALTER TABLE public.orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id);
      CREATE INDEX idx_orders_customer ON public.orders (customer_id);
    `;

    const schema = parseSchemaSQL(ddl);
    expect(schema.tables['customers']).toBeDefined();
    expect(schema.tables['orders']).toBeDefined();
    expect(schema.foreignKeys.length).toBe(1);
    expect(schema.foreignKeys[0].fromTable).toBe('orders');
    expect(schema.foreignKeys[0].toTable).toBe('customers');
    expect(schema.tables['orders'].indexes.length).toBe(1);
    expect(schema.tables['orders'].indexes[0].name).toBe('idx_orders_customer');
  });
});
