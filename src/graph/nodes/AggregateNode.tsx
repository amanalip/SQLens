import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Layers } from 'lucide-react';
import styles from './NodeStyles.module.css';

export interface AggregateNodeData {
  columns: string[];
  raw: string;
}

export const AggregateNode: React.FC<NodeProps> = ({ data, selected }) => {
  const aggData = data as unknown as AggregateNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#ec4899' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-aggregate, #ec4899)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
          <Layers size={13} />
        </div>
        <span className={styles.nodeTitle}>GROUP BY</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}
        >
          AGGREGATE
        </span>
      </div>
      <div className={styles.nodeBody}>
        <div>Group keys:</div>
        <div className={styles.codeSnippet}>{aggData.raw || aggData.columns?.join(', ') || 'ALL'}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#ec4899' }} />
    </div>
  );
};
