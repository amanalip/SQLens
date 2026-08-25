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

  const rawLabel = (data as { label?: string })?.label;
  const label = rawLabel ? rawLabel.replace(/->/g, '→') : undefined;

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
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'monospace',
              color: 'var(--text-secondary, #9ca3af)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {label.includes('→') ? (
              <>
                <span>{label.split('→')[0].trim()}</span>
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: '1',
                    margin: '0 4px',
                    color: 'var(--node-join, #8b5cf6)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  →
                </span>
                <span>{label.split('→')[1].trim()}</span>
              </>
            ) : (
              label
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
