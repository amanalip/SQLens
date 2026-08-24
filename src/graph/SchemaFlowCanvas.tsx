import React, { useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TableCardNode } from './nodes/TableCardNode';
import { ForeignKeyEdge } from './edges/ForeignKeyEdge';
import { SchemaModel } from '../model/schema';
import { buildSchemaGraph } from '../layout/schemaLayout';

interface SchemaFlowCanvasProps {
  schema: SchemaModel;
  onSelectTable?: (tableData: Record<string, unknown> | null) => void;
  theme?: 'dark' | 'light';
}

const SchemaFlowInner: React.FC<SchemaFlowCanvasProps> = ({
  schema,
  onSelectTable,
  theme = 'dark',
}) => {
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      tableCardNode: TableCardNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      foreignKeyEdge: ForeignKeyEdge,
    }),
    []
  );

  const initialGraph = useMemo(() => buildSchemaGraph(schema), [schema]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  useEffect(() => {
    const layout = buildSchemaGraph(schema);
    setNodes(layout.nodes);
    setEdges(layout.edges);
    const timeout = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    return () => clearTimeout(timeout);
  }, [schema, setNodes, setEdges, fitView]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_evt, node: Node) => {
          if (onSelectTable) {
            onSelectTable(node.data as Record<string, unknown>);
          }
        }}
        onPaneClick={() => {
          if (onSelectTable) {
            onSelectTable(null);
          }
        }}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color={theme === 'dark' ? '#2a3649' : '#cbd5e1'}
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          style={{
            background: theme === 'dark' ? '#161d27' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#2a3649' : '#e2e8f0'}`,
            borderRadius: 6,
          }}
          maskColor={theme === 'dark' ? 'rgba(15, 20, 28, 0.7)' : 'rgba(248, 250, 252, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
};

export const SchemaFlowCanvas: React.FC<SchemaFlowCanvasProps> = (props) => {
  return <SchemaFlowInner {...props} />;
};
