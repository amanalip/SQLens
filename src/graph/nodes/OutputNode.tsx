import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Projection } from '../../model/query';
import styles from './NodeStyles.module.css';

export interface OutputNodeData {
  projections: Projection[];
  isStar: boolean;
  queryType: string;
}

export const OutputNode: React.FC<NodeProps> = ({ data, selected }) => {
  const outputData = data as unknown as OutputNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#10b981' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-output, #10b981)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <CheckCircle2 size={13} />
        </div>
        <span className={styles.nodeTitle}>{outputData.queryType} Projection</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
        >
          OUTPUT
        </span>
      </div>
      <div className={styles.nodeBody}>
        {outputData.isStar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#f59e0b',
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            <AlertTriangle size={12} />
            <span>Wildcard projection (SELECT *)</span>
          </div>
        )}
        <div className={styles.codeSnippet}>
          {outputData.projections && outputData.projections.length > 0
            ? outputData.projections
                .map((p) => p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*')
                .join('\n')
            : '*'}
        </div>
      </div>
    </div>
  );
};
