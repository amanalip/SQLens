import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowDownUp } from 'lucide-react';
import { SortClause, LimitClause } from '../../model/query';
import styles from './NodeStyles.module.css';

export interface SortLimitNodeData {
  orderBy: SortClause[];
  limit?: LimitClause;
}

export const SortLimitNode: React.FC<NodeProps> = ({ data, selected }) => {
  const sortData = data as unknown as SortLimitNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#06b6d4' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-sort, #06b6d4)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
          <ArrowDownUp size={13} />
        </div>
        <span className={styles.nodeTitle}>Order & Limit</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}
        >
          SORT / SLICE
        </span>
      </div>
      <div className={styles.nodeBody}>
        {sortData.orderBy.length > 0 && (
          <div>
            <div>Sort:</div>
            <div className={styles.codeSnippet}>
              {sortData.orderBy.map((o) => `${o.column} ${o.direction}`).join(', ')}
            </div>
          </div>
        )}
        {sortData.limit && (
          <div style={{ marginTop: sortData.orderBy.length > 0 ? 6 : 0 }}>
            <div>Limit:</div>
            <div className={styles.codeSnippet}>
              LIMIT {sortData.limit.count}
              {sortData.limit.offset !== undefined ? ` OFFSET ${sortData.limit.offset}` : ''}
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#06b6d4' }} />
    </div>
  );
};
