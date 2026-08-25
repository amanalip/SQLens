import { describe, it, expect } from 'vitest';
import { parseSchemaSQL } from '../src/parser/schemaParser';

describe('Column Nullability & Primary Key Parsing', () => {
  it('correctly sets nullable to false for primary keys and NOT NULL constraints', () => {
    const ddl = `
      CREATE TABLE users (
        user_id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        bio TEXT NULL
      );
    `;
    const schema = parseSchemaSQL(ddl);
    const userIdCol = schema.tables.users.columns.find((c) => c.name === 'user_id');
    expect(userIdCol?.nullable).toBe(false);
    expect(userIdCol?.isPrimaryKey).toBe(true);

    const emailCol = schema.tables.users.columns.find((c) => c.name === 'email');
    expect(emailCol?.nullable).toBe(false);
    expect(emailCol?.isUnique).toBe(true);

    const bioCol = schema.tables.users.columns.find((c) => c.name === 'bio');
    expect(bioCol?.nullable).toBe(true);
  });
});
