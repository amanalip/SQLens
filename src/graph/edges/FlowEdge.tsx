import React from 'react';
import { BaseEdge, getBezierPath, EdgeProps } from '@xyflow/react';

export const FlowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: 'var(--accent, #3b82f6)',
        strokeWidth: 2,
      }}
    />
  );
};
