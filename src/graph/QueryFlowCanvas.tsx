import { useMemo, useEffect } from 'react';
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
import '@xyflow/react/dist/style.css';

import { TableNode } from './nodes/TableNode';
import { JoinNode } from './nodes/JoinNode';
import { FilterNode } from './nodes/FilterNode';
import { AggregateNode } from './nodes/AggregateNode';
import { SortLimitNode } from './nodes/SortLimitNode';
import { OutputNode } from './nodes/OutputNode';
import { CTESubgraphNode } from './nodes/CTESubgraphNode';
import { FlowEdge } from './edges/FlowEdge';
import { QueryModel } from '../model/query';
import { buildQueryGraph } from '../layout/queryLayout';

interface QueryFlowCanvasProps {
  model: QueryModel;
  onSelectNode?: (nodeData: Record<string, unknown> | null, nodeType?: string) => void;
  theme?: 'dark' | 'light';
}

const FlowInner: React.FC<QueryFlowCanvasProps> = ({ model, onSelectNode, theme = 'dark' }) => {
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      tableNode: TableNode,
      joinNode: JoinNode,
      filterNode: FilterNode,
      aggregateNode: AggregateNode,
      sortLimitNode: SortLimitNode,
      outputNode: OutputNode,
      cteNode: CTESubgraphNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      flowEdge: FlowEdge,
    }),
    []
  );

  const initialGraph = useMemo(() => buildQueryGraph(model), [model]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  useEffect(() => {
    const layout = buildQueryGraph(model);
    setNodes(layout.nodes);
    setEdges(layout.edges);
    const timeout = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    return () => clearTimeout(timeout);
  }, [model, setNodes, setEdges, fitView]);

  // Center on window resize
  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2, duration: 200 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitView]);

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
          if (onSelectNode) {
            onSelectNode(node.data as Record<string, unknown>, node.type);
          }
        }}
        onPaneClick={() => {
          if (onSelectNode) {
            onSelectNode(null);
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
            if (n.type === 'tableNode' || n.type === 'tableCardNode') return '#3b82f6';
            if (n.type === 'joinNode') return '#8b5cf6';
            if (n.type === 'filterNode') return '#f59e0b';
            if (n.type === 'aggregateNode') return '#06b6d4';
            if (n.type === 'sortLimitNode') return '#ec4899';
            if (n.type === 'outputNode') return '#10b981';
            if (n.type === 'cteNode') return '#a855f7';
            return '#64748b';
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

export const QueryFlowCanvas: React.FC<QueryFlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
};
