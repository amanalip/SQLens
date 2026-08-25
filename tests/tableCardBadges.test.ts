import { describe, it, expect } from 'vitest';
import { ColumnSchema } from '../src/model/schema';

function computeBadges(col: ColumnSchema) {
  return {
    isPK: Boolean(col.isPrimaryKey),
    isFK: Boolean(col.isForeignKey),
    isUQ: Boolean(col.isUnique && !col.isPrimaryKey),
    isNN: Boolean(col.nullable === false && !col.isPrimaryKey),
    isDEF: Boolean(col.defaultValue !== undefined && !col.isPrimaryKey),
  };
}

describe('Table Column Badge Calculations', () => {
  it('identifies primary key badges', () => {
    const col: ColumnSchema = { name: 'id', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, nullable: false };
    const badges = computeBadges(col);
    expect(badges.isPK).toBe(true);
    expect(badges.isNN).toBe(false);
  });

  it('identifies foreign key, unique, and not null constraints on non-PK columns', () => {
    const col: ColumnSchema = {
      name: 'email',
      type: 'TEXT',
      isPrimaryKey: false,
      isForeignKey: false,
      isUnique: true,
      nullable: false,
      defaultValue: 'none@domain.com',
    };
    const badges = computeBadges(col);
    expect(badges.isPK).toBe(false);
    expect(badges.isUQ).toBe(true);
    expect(badges.isNN).toBe(true);
    expect(badges.isDEF).toBe(true);
  });
});
