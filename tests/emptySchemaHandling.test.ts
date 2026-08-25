import { describe, it, expect } from 'vitest';
import { SchemaModel } from '../src/model/schema';
import { buildSchemaGraph } from '../src/layout/schemaLayout';

describe('Empty Schema Graph Layout Handling', () => {
  it('handles empty tables object gracefully without exceptions', () => {
    const emptySchema: SchemaModel = {
      tables: {},
      foreignKeys: [],
      orphanTables: [],
      missingIndexFkColumns: [],
    };
    const layout = buildSchemaGraph(emptySchema);
    expect(layout.nodes).toEqual([]);
    expect(layout.edges).toEqual([]);
  });

  it('handles single orphan table correctly without foreign key edges', () => {
    const singleTableSchema: SchemaModel = {
      tables: {
        config: {
          name: 'config',
          columns: [{ name: 'key', type: 'TEXT', isPrimaryKey: true, isForeignKey: false, nullable: false }],
          primaryKey: ['key'],
          indexes: [],
          foreignKeys: [],
        },
      },
      foreignKeys: [],
      orphanTables: ['config'],
      missingIndexFkColumns: [],
    };
    const layout = buildSchemaGraph(singleTableSchema);
    expect(layout.nodes).toHaveLength(1);
    expect(layout.edges).toHaveLength(0);
    expect(layout.nodes[0].id).toBe('table_config');
  });
});
