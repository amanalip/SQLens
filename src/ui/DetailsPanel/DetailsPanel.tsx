import React from 'react';
import { Info, X, Database, GitMerge, Filter, Layers, ArrowDownUp, CheckCircle } from 'lucide-react';
import { TableSchema } from '../../model/schema';
import styles from './DetailsPanel.module.css';

interface DetailsPanelProps {
  selectedNode: {
    type?: string;
    data: Record<string, unknown>;
  } | null;
  onClose: () => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <span>Inspector</span>
        </div>
        <div className={styles.emptyState}>
          <Info size={20} />
          <div>Click any node in the graph or table card to inspect details</div>
        </div>
      </div>
    );
  }

  const { type, data } = selectedNode;

  // Schema Table Card Inspector
  if (type === 'tableCardNode' || data.table) {
    const table = (data.table || data) as TableSchema;
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Database size={14} color="#3b82f6" />
            <span>Table: {table.name}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #6b7280)', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Overview</div>
            <div className={styles.propertyRow}>
              <span className={styles.propertyLabel}>Total Columns:</span>
              <span className={styles.propertyValue}>{table.columns?.length || 0}</span>
            </div>
            {table.rowCount !== undefined && (
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Row Count:</span>
                <span className={styles.propertyValue}>{table.rowCount}</span>
              </div>
            )}
            <div className={styles.propertyRow}>
              <span className={styles.propertyLabel}>Primary Keys:</span>
              <span className={styles.propertyValue}>
                {table.primaryKey?.length ? table.primaryKey.join(', ') : 'None'}
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Columns ({table.columns?.length || 0})</div>
            {table.columns?.map((c) => (
              <div key={c.name} className={styles.propertyRow}>
                <span className={styles.propertyLabel}>
                  {c.name} {c.isPrimaryKey ? '(PK)' : ''} {c.isForeignKey ? '(FK)' : ''}
                </span>
                <span className={styles.propertyValue}>{c.type}</span>
              </div>
            ))}
          </div>

          {table.foreignKeys?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Relationships ({table.foreignKeys.length})</div>
              {table.foreignKeys.map((fk, idx) => (
                <div key={idx} className={styles.codeBlock}>
                  {fk.fromColumn} -&gt; {fk.toTable}({fk.toColumn})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Query Mode Node Inspector
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {type === 'tableNode' && <Database size={14} color="#3b82f6" />}
          {type === 'joinNode' && <GitMerge size={14} color="#8b5cf6" />}
          {type === 'filterNode' && <Filter size={14} color="#f59e0b" />}
          {type === 'aggregateNode' && <Layers size={14} color="#ec4899" />}
          {type === 'sortLimitNode' && <ArrowDownUp size={14} color="#06b6d4" />}
          {type === 'outputNode' && <CheckCircle size={14} color="#10b981" />}
          <span>Node Details</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #6b7280)', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      </div>

      <div className={styles.content}>
        {type === 'tableNode' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Source Table</div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Table Name:</span>
                <span className={styles.propertyValue}>{String(data.name)}</span>
              </div>
              {Boolean(data.alias) && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Alias:</span>
                  <span className={styles.propertyValue}>{String(data.alias)}</span>
                </div>
              )}
            </div>
          </>
        )}

        {type === 'joinNode' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Join Operation</div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Type:</span>
                <span className={styles.propertyValue}>{String(data.type)} JOIN</span>
              </div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Target Table:</span>
                <span className={styles.propertyValue}>{String(data.rightTable)}</span>
              </div>
            </div>
            {data.onCondition && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Join Condition (ON)</div>
                <div className={styles.codeBlock}>{String(data.onCondition)}</div>
              </div>
            )}
          </>
        )}

        {type === 'filterNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{String(data.type)} Condition</div>
            <div className={styles.codeBlock}>{String(data.raw)}</div>
          </div>
        )}

        {type === 'aggregateNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>GROUP BY Keys</div>
            <div className={styles.codeBlock}>{String(data.raw)}</div>
          </div>
        )}

        {type === 'outputNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Selected Projections</div>
            <div className={styles.codeBlock}>
              {Array.isArray(data.projections)
                ? (data.projections as Array<{ raw: string }>).map((p) => p.raw).join('\n')
                : '*'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
