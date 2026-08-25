import { describe, it, expect } from 'vitest';
import { SchemaModel } from '../src/model/schema';
import { buildSchemaGraph } from '../src/layout/schemaLayout';

describe('Schema Search Matching Table & Column Names', () => {
  const schema: SchemaModel = {
    tables: {
      customers: {
        name: 'customers',
        columns: [
          { name: 'customer_id', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, nullable: false },
          { name: 'billing_country', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, nullable: true },
          { name: 'postal_code', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, nullable: true },
        ],
        primaryKey: ['customer_id'],
        indexes: [],
        foreignKeys: [],
      },
      invoices: {
        name: 'invoices',
        columns: [
          { name: 'invoice_id', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, nullable: false },
          { name: 'total_amount', type: 'REAL', isPrimaryKey: false, isForeignKey: false, nullable: false },
        ],
        primaryKey: ['invoice_id'],
        indexes: [],
        foreignKeys: [],
      },
    },
    foreignKeys: [],
    orphanTables: [],
    missingIndexFkColumns: [],
  };

  function matchTables(query: string) {
    const layout = buildSchemaGraph(schema);
    const q = query.toLowerCase();
    return layout.nodes.filter((n) => {
      const tableObj = n.data?.table as { name?: string; columns?: Array<{ name: string }> } | undefined;
      const tableName = String(tableObj?.name || '').toLowerCase();
      const hasMatchingCol = (tableObj?.columns || []).some((col) =>
        col.name.toLowerCase().includes(q)
      );
      return tableName.includes(q) || hasMatchingCol;
    });
  }

  it('matches tables by table name query', () => {
    const matched = matchTables('invoices');
    expect(matched).toHaveLength(1);
    expect(matched[0].id).toBe('table_invoices');
  });

  it('matches tables by contained column name query', () => {
    const matched = matchTables('billing_country');
    expect(matched).toHaveLength(1);
    expect(matched[0].id).toBe('table_customers');
  });

  it('matches multiple tables when searching a common keyword', () => {
    const matched = matchTables('_id');
    expect(matched).toHaveLength(2);
  });
});
