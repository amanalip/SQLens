import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import styles from './NodeStyles.module.css';

export interface TableNodeData {
  name: string;
  alias?: string;
  schema?: string;
}

export const TableNode: React.FC<NodeProps> = ({ data, selected }) => {
  const tableData = data as unknown as TableNodeData;

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6' }} />
      <div className={styles.nodeHeader} style={{ borderLeft: '3px solid var(--node-table, #3b82f6)' }}>
        <div className={styles.headerIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
          <Database size={13} />
        </div>
        <span className={styles.nodeTitle}>{tableData.name}</span>
        <span
          className={styles.nodeBadge}
          style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
        >
          TABLE
        </span>
      </div>
      <div className={styles.nodeBody}>
        {tableData.alias && (
          <div>
            Alias: <strong>{tableData.alias}</strong>
          </div>
        )}
        {tableData.schema && (
          <div className={styles.nodeSubtext}>Schema: {tableData.schema}</div>
        )}
        {!tableData.alias && !tableData.schema && (
          <div className={styles.nodeSubtext}>Source table</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} />
    </div>
  );
};
