import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import { bundledDatabases } from '../src/samples';
import { parseSQL } from '../src/parser/parser';

describe('Database Catalog & Sample Queries Verification', () => {
  it('contains 23 registered databases with 20 verified queries each', () => {
    expect(bundledDatabases.length).toBe(23);
    bundledDatabases.forEach((db) => {
      expect(db.samples.length).toBe(20);
    });
  });

  it('verifies all 460 sample queries parse into valid AST models', () => {
    let totalQueries = 0;
    bundledDatabases.forEach((db) => {
      db.samples.forEach((sample) => {
        totalQueries++;
        const res = parseSQL(sample.sql);
        expect(res.model).toBeDefined();
        expect(res.model.rawSql).toBe(sample.sql.trim());
        expect(res.model.sources.length).toBeGreaterThan(0);
      });
    });
    expect(totalQueries).toBe(460);
  });

  it('executes all 460 sample queries against live in-memory SQLite databases with zero errors', async () => {
    const SQL = await initSqlJs();
    const dbDir = path.resolve(__dirname, '../public/databases');

    for (const dbConfig of bundledDatabases) {
      const dbFilename = path.basename(dbConfig.filename);
      const dbPath = path.join(dbDir, dbFilename);
      expect(fs.existsSync(dbPath)).toBe(true);

      const fileBuffer = fs.readFileSync(dbPath);
      const db = new SQL.Database(fileBuffer);

      for (const sample of dbConfig.samples) {
        expect(() => {
          db.exec(sample.sql);
        }).not.toThrow();
      }

      db.close();
    }
  });
});
