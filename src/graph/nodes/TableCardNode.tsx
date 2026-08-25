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
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {table.rowCount !== undefined && (
            <span
              className={styles.orphanBadge}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}
              title={`${table.rowCount.toLocaleString()} total rows`}
            >
              {table.rowCount.toLocaleString()} rows
            </span>
          )}
          {table.indexes && table.indexes.length > 0 && (
            <span
              className={styles.orphanBadge}
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa',
                borderColor: 'rgba(139, 92, 246, 0.3)',
              }}
              title={`${table.indexes.length} indexes`}
            >
              {table.indexes.length} idx
            </span>
          )}
          {isOrphan && <span className={styles.orphanBadge}>Orphan</span>}
        </div>
      </div>
      <div className={styles.tableColumnList}>
        {table.columns && table.columns.length > 0 ? (
          table.columns.map((col) => {
            const handleId = `${table.name}_${col.name}`;
            const refText = col.references ? ` → ${col.references.table}.${col.references.column}` : '';
            const defText = col.defaultValue !== undefined ? ` (DEFAULT ${col.defaultValue})` : '';
            const tooltip = `${col.name} (${col.type})${col.isPrimaryKey ? ' - Primary Key' : ''}${
              col.isForeignKey ? ` - Foreign Key${refText}` : ''
            }${col.isUnique ? ' - Unique' : ''}${col.nullable === false ? ' - NOT NULL' : ''}${defText}`;

            return (
              <div key={col.name} className={styles.columnRow} title={tooltip}>
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
                  {col.isForeignKey && (
                    <span
                      className={styles.fkBadge}
                      title={col.references ? `References ${col.references.table}.${col.references.column}` : 'Foreign Key'}
                    >
                      FK
                    </span>
                  )}
                  {col.isUnique && !col.isPrimaryKey && (
                    <span
                      className={styles.pkBadge}
                      style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}
                    >
                      UQ
                    </span>
                  )}
                  {col.nullable === false && !col.isPrimaryKey && (
                    <span
                      className={styles.pkBadge}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: 9 }}
                      title="NOT NULL constraint"
                    >
                      NN
                    </span>
                  )}
                  {col.defaultValue !== undefined && (
                    <span
                      className={styles.pkBadge}
                      style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', fontSize: 9 }}
                      title={`Default: ${col.defaultValue}`}
                    >
                      DEF
                    </span>
                  )}
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
          })
        ) : (
          <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted, #6b7280)' }}>
            No columns defined
          </div>
        )}
      </div>
    </div>
  );
};
