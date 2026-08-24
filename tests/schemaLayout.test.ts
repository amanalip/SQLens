import { describe, it, expect } from 'vitest';
import { buildSchemaGraph } from '../src/layout/schemaLayout';
import { SchemaModel } from '../src/model/schema';

describe('Schema Layout Graph Builder', () => {
  it('handles empty schema correctly', () => {
    const emptySchema: SchemaModel = {
      tables: {},
      foreignKeys: [],
      orphanTables: [],
      missingIndexFkColumns: [],
    };
    const result = buildSchemaGraph(emptySchema);
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it('builds nodes and relationship edges with distinct handle IDs', () => {
    const schema: SchemaModel = {
      tables: {
        users: {
          name: 'users',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
            { name: 'name', type: 'TEXT', nullable: false, isPrimaryKey: false, isForeignKey: false },
          ],
          primaryKey: ['id'],
          foreignKeys: [],
          indexes: [],
        },
        orders: {
          name: 'orders',
          columns: [
            { name: 'order_id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
            { name: 'user_id', type: 'INTEGER', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'users', column: 'id' } },
          ],
          primaryKey: ['order_id'],
          foreignKeys: [
            {
              id: 'fk_orders_user_id',
              fromTable: 'orders',
              fromColumn: 'user_id',
              toTable: 'users',
              toColumn: 'id',
            },
          ],
          indexes: [],
        },
      },
      foreignKeys: [
        {
          id: 'fk_orders_user_id',
          fromTable: 'orders',
          fromColumn: 'user_id',
          toTable: 'users',
          toColumn: 'id',
        },
      ],
      orphanTables: [],
      missingIndexFkColumns: [],
    };

    const result = buildSchemaGraph(schema);
    expect(result.nodes.length).toBe(2);
    expect(result.edges.length).toBe(1);

    const edge = result.edges[0];
    expect(edge.source).toBe('table_orders');
    expect(edge.target).toBe('table_users');
    expect(edge.sourceHandle).toBe('orders_user_id_source');
    expect(edge.targetHandle).toBe('users_id_target');
  });

  it('flags orphan tables correctly in node data', () => {
    const schema: SchemaModel = {
      tables: {
        logs: {
          name: 'logs',
          columns: [{ name: 'log_id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false }],
          primaryKey: ['log_id'],
          foreignKeys: [],
          indexes: [],
        },
      },
      foreignKeys: [],
      orphanTables: ['logs'],
      missingIndexFkColumns: [],
    };

    const result = buildSchemaGraph(schema);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].data.isOrphan).toBe(true);
  });
});
