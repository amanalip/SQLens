import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitMerge } from 'lucide-react';
import styles from './NodeStyles.module.css';

export interface JoinNodeData {
  type: string;
  leftTable: string;
  rightTable: string;
  onCondition?: string;
  usingColumns?: string[];
}

export const JoinNode: React.FC<NodeProps> = ({ data, selected }) => {
  const joinData = data as unknown as JoinNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#8b5cf6' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-join, #8b5cf6)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
          <GitMerge size={13} />
        </div>
        <span className={styles.nodeTitle}>{joinData.rightTable}</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}
        >
          {joinData.type} JOIN
        </span>
      </div>
      <div className={styles.nodeBody}>
        {joinData.onCondition && (
          <div className={styles.codeSnippet}>ON {joinData.onCondition}</div>
        )}
        {joinData.usingColumns && (
          <div className={styles.codeSnippet}>
            USING ({joinData.usingColumns.join(', ')})
          </div>
        )}
        {!joinData.onCondition && !joinData.usingColumns && (
          <div className={styles.nodeSubtext} style={{ color: '#f59e0b' }}>
            Cartesian product (no ON condition)
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#8b5cf6' }} />
    </div>
  );
};
