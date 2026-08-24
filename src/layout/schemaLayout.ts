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

  // Grid layout calculation
  const COLUMNS_COUNT = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(tableNames.length))));
  const X_SPACING = 360;
  const Y_SPACING = 340;

  tableNames.forEach((tableName, index) => {
    const table = schema.tables[tableName];
    const colIndex = index % COLUMNS_COUNT;
    const rowIndex = Math.floor(index / COLUMNS_COUNT);

    const x = 50 + colIndex * X_SPACING;
    const y = 50 + rowIndex * Y_SPACING;

    nodes.push({
      id: `table_${tableName}`,
      type: 'tableCardNode',
      position: { x, y },
      data: {
        table,
        isOrphan: schema.orphanTables.includes(tableName),
      },
    });
  });

  // Build relationship edges
  schema.foreignKeys.forEach((fk, index) => {
    const sourceNodeId = `table_${fk.fromTable}`;
    const targetNodeId = `table_${fk.toTable}`;

    // Verify both tables exist in schema
    if (schema.tables[fk.fromTable] && schema.tables[fk.toTable]) {
      edges.push({
        id: `fk_edge_${index}_${fk.fromTable}_${fk.toTable}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: `${fk.fromTable}_${fk.fromColumn}`,
        targetHandle: `${fk.toTable}_${fk.toColumn}`,
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
