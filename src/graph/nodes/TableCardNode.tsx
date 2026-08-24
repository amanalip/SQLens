import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Table as TableIcon, Key, Link2 } from 'lucide-react';
import { TableSchema } from '../../model/schema';
import styles from './NodeStyles.module.css';

export interface TableCardNodeData {
  table: TableSchema;
  isOrphan: boolean;
}

export const TableCardNode: React.FC<NodeProps> = ({ data, selected }) => {
  const cardData = data as unknown as TableCardNodeData;
  const { table, isOrphan } = cardData;

  return (
    <div className={`${styles.tableCard} ${selected ? styles.selected : ''}`}>
      <div className={styles.tableCardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TableIcon size={14} color="#3b82f6" />
          <span className={styles.tableName}>{table.name}</span>
        </div>
        {isOrphan && <span className={styles.orphanBadge}>Orphan</span>}
      </div>
      <div className={styles.tableColumnList}>
        {table.columns.map((col) => {
          const handleId = `${table.name}_${col.name}`;
          return (
            <div key={col.name} className={styles.columnRow}>
              {/* Target handle on left for incoming foreign keys */}
              <Handle
                type="target"
                position={Position.Left}
                id={`${handleId}_target`}
                style={{
                  top: '50%',
                  background: col.isPrimaryKey ? '#f59e0b' : '#3b82f6',
                  width: 6,
                  height: 6,
                }}
              />

              <div className={styles.columnNameGroup}>
                {col.isPrimaryKey && <Key size={11} color="#f59e0b" />}
                {col.isForeignKey && !col.isPrimaryKey && <Link2 size={11} color="#3b82f6" />}
                <span className={styles.columnName}>{col.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {col.isPrimaryKey && <span className={styles.pkBadge}>PK</span>}
                {col.isForeignKey && <span className={styles.fkBadge}>FK</span>}
                <span className={styles.columnType}>{col.type}</span>
              </div>

              {/* Source handle on right for outgoing foreign keys */}
              <Handle
                type="source"
                position={Position.Right}
                id={`${handleId}_source`}
                style={{
                  top: '50%',
                  background: col.isPrimaryKey ? '#f59e0b' : '#3b82f6',
                  width: 6,
                  height: 6,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
