import React from 'react';
import { BaseEdge, getSmoothStepPath, EdgeProps, EdgeLabelRenderer } from '@xyflow/react';

export const ForeignKeyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const label = (data as { label?: string })?.label;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: 'var(--node-join, #8b5cf6)',
          strokeWidth: 2,
          strokeDasharray: '4 2',
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'var(--bg-card, #1a222f)',
              border: '1px solid var(--border, #2a3649)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontFamily: 'monospace',
              color: 'var(--text-secondary, #9ca3af)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 10,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
