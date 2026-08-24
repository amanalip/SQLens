import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter } from 'lucide-react';
import styles from './NodeStyles.module.css';

export interface FilterNodeData {
  type: 'WHERE' | 'HAVING';
  raw: string;
  columns: string[];
}

export const FilterNode: React.FC<NodeProps> = ({ data, selected }) => {
  const filterData = data as unknown as FilterNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-filter, #f59e0b)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
          <Filter size={13} />
        </div>
        <span className={styles.nodeTitle}>{filterData.type} Filter</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
        >
          FILTER
        </span>
      </div>
      <div className={styles.nodeBody}>
        <div className={styles.codeSnippet}>{filterData.raw}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#f59e0b' }} />
    </div>
  );
};
