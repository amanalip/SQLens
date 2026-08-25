import { Node, Edge, MarkerType } from '@xyflow/react';
import { SchemaModel } from '../model/schema';

export interface SchemaLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function buildSchemaGraph(schema: SchemaModel): SchemaLayoutResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const tableNames = Object.keys(schema.tables);
  if (tableNames.length === 0) {
    return { nodes, edges };
  }

  // Dynamic masonry column layout calculation
  const COLUMNS_COUNT = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(tableNames.length))));
  const X_SPACING = 380;

  // Track max Y offset per column to prevent vertical card overlap
  const columnYOffsets = new Array(COLUMNS_COUNT).fill(50);

  tableNames.forEach((tableName, index) => {
    const table = schema.tables[tableName];
    const colIndex = index % COLUMNS_COUNT;
    const x = 50 + colIndex * X_SPACING;
    const y = columnYOffsets[colIndex];

    const cardHeight = Math.max(200, 60 + (table.columns?.length || 0) * 26 + 30);
    columnYOffsets[colIndex] += cardHeight;

    const isOrphan = Array.isArray(schema.orphanTables) ? schema.orphanTables.includes(tableName) : false;

    nodes.push({
      id: `table_${tableName}`,
      type: 'tableCardNode',
      position: { x, y },
      data: {
        table,
        isOrphan,
      },
    });
  });

  // Build relationship edges
  const fks = Array.isArray(schema.foreignKeys)
    ? schema.foreignKeys
    : Array.isArray((schema as unknown as { relationships?: unknown[] }).relationships)
    ? (schema as unknown as { relationships: Array<{ fromTable: string; toTable: string; fromColumn: string; toColumn: string }> }).relationships
    : [];

  fks.forEach((fk, index) => {
    const sourceNodeId = `table_${fk.fromTable}`;
    const targetNodeId = `table_${fk.toTable}`;

    // Verify both tables exist in schema
    if (schema.tables[fk.fromTable] && schema.tables[fk.toTable]) {
      edges.push({
        id: `fk_edge_${index}_${fk.fromTable}_${fk.toTable}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: `${fk.fromTable}_${fk.fromColumn}_source`,
        targetHandle: `${fk.toTable}_${fk.toColumn}_target`,
        type: 'foreignKeyEdge',
        data: {
          fromCol: fk.fromColumn,
          toCol: fk.toColumn,
          label: `${fk.fromColumn} -> ${fk.toColumn}`,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
        },
      });
    }
  });

  return { nodes, edges };
}
