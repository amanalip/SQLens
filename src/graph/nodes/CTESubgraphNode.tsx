import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { QueryModel } from '../../model/query';
import styles from './NodeStyles.module.css';

export interface CTENodeData {
  name: string;
  model: QueryModel;
  summary: string;
}

export const CTESubgraphNode: React.FC<NodeProps> = ({ data, selected }) => {
  const cteData = data as unknown as CTENodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-cte, #6366f1)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
          <Box size={13} />
        </div>
        <span className={styles.nodeTitle}>CTE: {cteData.name}</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}
        >
          WITH BLOCK
        </span>
      </div>
      <div className={styles.nodeBody}>
        <div>Sub-pipeline:</div>
        <div className={styles.codeSnippet}>{cteData.summary}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
    </div>
  );
};
