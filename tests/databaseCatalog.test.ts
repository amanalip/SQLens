import { describe, it, expect } from 'vitest';
import { bundledDatabases } from '../src/samples';
import { parseSQL } from '../src/parser/parser';

describe('Database Catalog & Sample Queries Verification', () => {
  it('contains 23 registered databases', () => {
    expect(bundledDatabases.length).toBe(23);
  });

  it('verifies all bundled database samples parse into valid AST models', () => {
    bundledDatabases.forEach((db) => {
      expect(db.samples.length).toBeGreaterThan(0);
      db.samples.forEach((sample) => {
        const res = parseSQL(sample.sql);
        expect(res.model).toBeDefined();
        expect(res.model.rawSql).toBe(sample.sql.trim());
        expect(res.model.sources.length).toBeGreaterThan(0);
      });
    });
  });
});
