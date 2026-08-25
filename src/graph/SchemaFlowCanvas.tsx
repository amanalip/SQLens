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
          const tableObj = n.data?.table as { name?: string; columns?: Array<{ name: string }> } | undefined;
          const tableName = String(tableObj?.name || '').toLowerCase();
          const hasMatchingCol = (tableObj?.columns || []).some((col) =>
            col.name.toLowerCase().includes(query)
          );
          const matches = tableName.includes(query) || hasMatchingCol;
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

  // Center on window resize
  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2, duration: 200 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitView]);

  const hasTables = schema?.tables && Object.keys(schema.tables).length > 0;

  if (!hasTables) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted, #6b7280)',
          fontSize: 13,
          gap: 8,
          padding: 24,
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--text-secondary, #9ca3af)' }}>
          No Tables in Schema
        </div>
        <div>Create new tables via Query Mode or upload an existing SQLite database.</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        data-export-ignore="true"
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
          placeholder="Filter tables or columns..."
          aria-label="Filter schema tables"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchQuery('');
            }
          }}
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
            aria-label="Clear table filter"
            title="Clear table filter (Escape)"
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
          nodeColor={(n) => {
            if ((n.data as { isOrphan?: boolean })?.isOrphan) return '#f59e0b';
            return '#3b82f6';
          }}
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
