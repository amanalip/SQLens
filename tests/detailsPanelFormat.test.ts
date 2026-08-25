import { describe, it, expect } from 'vitest';
import { ForeignKeyReference } from '../src/model/schema';

function formatRelationship(fk: ForeignKeyReference): string {
  return `${fk.fromColumn} → ${fk.toTable}(${fk.toColumn})`;
}

function formatColumnReference(table: string, column: string): string {
  return `→ ${table}.${column}`;
}

describe('Details Panel Relationship Formatting', () => {
  it('formats foreign key relationship text with unicode arrow', () => {
    const fk: ForeignKeyReference = {
      id: 'fk_invoices_customers',
      fromTable: 'invoices',
      fromColumn: 'CustomerId',
      toTable: 'customers',
      toColumn: 'CustomerId',
    };
    expect(formatRelationship(fk)).toBe('CustomerId → customers(CustomerId)');
  });

  it('formats column target reference with unicode arrow', () => {
    expect(formatColumnReference('artists', 'ArtistId')).toBe('→ artists.ArtistId');
  });
});
