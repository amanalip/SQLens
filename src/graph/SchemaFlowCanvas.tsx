import { useMemo, useEffect, useState } from 'react';
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
  ReactFlowProvider,
} from '@xyflow/react';
import { Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setNodes(layout.nodes.map((n) => ({ ...n, style: { opacity: 1 } })));
    } else {
      setNodes(
        layout.nodes.map((n) => {
          const tableName = String((n.data?.table as { name?: string })?.name || '').toLowerCase();
          const matches = tableName.includes(query);
          return {
            ...n,
            style: {
              opacity: matches ? 1 : 0.25,
              transition: 'opacity 0.2s ease',
            },
          };
        })
      );
    }
    setEdges(layout.edges);
  }, [schema, searchQuery, setNodes, setEdges]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    return () => clearTimeout(timeout);
  }, [schema, fitView]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: theme === 'dark' ? '#161d27' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#2a3649' : '#e2e8f0'}`,
          borderRadius: 6,
          padding: '4px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Search size={13} color="var(--text-muted, #6b7280)" />
        <input
          type="text"
          placeholder="Filter tables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 12,
            color: 'var(--text-primary, #f3f4f6)',
            width: 140,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #6b7280)',
              cursor: 'pointer',
              fontSize: 12,
              padding: '0 2px',
            }}
          >
            ×
          </button>
        )}
      </div>
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
  return (
    <ReactFlowProvider>
      <SchemaFlowInner {...props} />
    </ReactFlowProvider>
  );
};
