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
            aria-label="Close inspector panel"
            title="Close inspector panel"
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
            {table.columns?.map((c) => {
              const flags = [
                c.isPrimaryKey ? 'PK' : null,
                c.isForeignKey ? 'FK' : null,
                c.isUnique && !c.isPrimaryKey ? 'UQ' : null,
                c.nullable === false && !c.isPrimaryKey ? 'NN' : null,
              ]
                .filter(Boolean)
                .join(', ');

              return (
                <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0', borderBottom: '1px solid var(--border-subtle, #222d3d)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.propertyLabel}>
                      {c.name} {flags ? `(${flags})` : ''}
                    </span>
                    <span className={styles.propertyValue}>{c.type}</span>
                  </div>
                  {c.defaultValue !== undefined && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted, #6b7280)' }}>
                      DEFAULT: <span style={{ color: 'var(--accent, #3b82f6)' }}>{c.defaultValue}</span>
                    </div>
                  )}
                  {c.references && (
                    <div style={{ fontSize: 10, color: 'var(--accent, #3b82f6)' }}>
                      → {c.references.table}.{c.references.column}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {table.sampleRows && table.sampleRows.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Sample Data Preview ({table.sampleRows.length} rows)</div>
              <div className={styles.previewTableWrapper}>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      {table.columns?.map((col) => (
                        <th key={col.name}>{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.sampleRows.map((sRow, rIdx) => (
                      <tr key={rIdx}>
                        {table.columns?.map((col) => (
                          <td key={col.name} title={String(sRow[col.name] ?? 'NULL')}>
                            {sRow[col.name] !== null && sRow[col.name] !== undefined ? String(sRow[col.name]) : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {table.indexes && table.indexes.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Indexes ({table.indexes.length})</div>
              {table.indexes.map((idx) => (
                <div key={idx.name} className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>
                    {idx.name} {idx.isUnique ? '(Unique)' : ''}
                  </span>
                  <span className={styles.propertyValue}>
                    {idx.columns.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {table.foreignKeys?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Relationships ({table.foreignKeys.length})</div>
              {table.foreignKeys.map((fk, idx) => (
                <div key={idx} className={styles.codeBlock}>
                  {fk.fromColumn} → {fk.toTable}({fk.toColumn})
                </div>
              ))}
            </div>
          )}

          {table.ddlSql && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Table DDL Definition</div>
              <div className={styles.codeBlock}>
                {table.ddlSql}
              </div>
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
          {(type === 'cteNode' || type === 'cteSubgraphNode') && <Layers size={14} color="#a855f7" />}
          <span>{type === 'cteNode' || type === 'cteSubgraphNode' ? `CTE: ${data.name || ''}` : 'Node Details'}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector panel"
          title="Close inspector panel"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #6b7280)', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      </div>

      <div className={styles.content}>
        {(type === 'cteNode' || type === 'cteSubgraphNode') && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Common Table Expression (WITH)</div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>CTE Name:</span>
                <span className={styles.propertyValue}>{String(data.name)}</span>
              </div>
              {Boolean(data.summary) && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Data Flow:</span>
                  <span className={styles.propertyValue}>{String(data.summary)}</span>
                </div>
              )}
            </div>
            {data.model && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>CTE Projections</div>
                <div className={styles.codeBlock}>
                  {(data.model as { projections?: Array<{ raw?: string; expr?: string; alias?: string }> }).projections
                    ?.map((p) => p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*')
                    .join('\n') || '*'}
                </div>
              </div>
            )}
          </>
        )}

        {type === 'tableNode' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Source Table</div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Table Name:</span>
                <span className={styles.propertyValue}>{String(data.name || '')}</span>
              </div>
              {Boolean(data.alias) && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Alias:</span>
                  <span className={styles.propertyValue}>{String(data.alias)}</span>
                </div>
              )}
              {Boolean(data.schema) && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Schema:</span>
                  <span className={styles.propertyValue}>{String(data.schema)}</span>
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
                <span className={styles.propertyValue}>{String(data.type || '')} JOIN</span>
              </div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Target Table:</span>
                <span className={styles.propertyValue}>{String(data.rightTable || '')}</span>
              </div>
            </div>
            {Boolean(data.onCondition) && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Join Condition (ON)</div>
                <div className={styles.codeBlock}>{String(data.onCondition)}</div>
              </div>
            )}
            {Boolean(data.usingColumns && Array.isArray(data.usingColumns) && data.usingColumns.length > 0) && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Join Columns (USING)</div>
                <div className={styles.codeBlock}>USING ({(data.usingColumns as string[]).join(', ')})</div>
              </div>
            )}
          </>
        )}

        {type === 'filterNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{String(data.type || 'WHERE')} Condition</div>
            <div className={styles.codeBlock}>
              {String(
                data.raw ||
                  (Array.isArray(data.columns) && data.columns.length > 0
                    ? (data.columns as string[]).join(' AND ')
                    : 'Condition')
              )}
            </div>
          </div>
        )}

        {type === 'aggregateNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>GROUP BY Keys</div>
            <div className={styles.codeBlock}>
              {String(
                data.raw ||
                  (Array.isArray(data.columns) && data.columns.length > 0
                    ? (data.columns as string[]).join(', ')
                    : 'ALL')
              )}
            </div>
          </div>
        )}

        {type === 'sortLimitNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Ordering & Pagination</div>
            {Array.isArray(data.orderBy) && (data.orderBy as Array<{ column: string; direction: string }>).length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <span className={styles.propertyLabel}>ORDER BY:</span>
                {(data.orderBy as Array<{ column: string; direction: string }>).map((o, idx) => (
                  <div key={idx} className={styles.codeBlock}>
                    {o.column} {o.direction}
                  </div>
                ))}
              </div>
            )}
            {Boolean(data.limit) && (
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>LIMIT / OFFSET:</span>
                <span className={styles.propertyValue}>
                  {(data.limit as { count: number; offset?: number }).count}
                  {(data.limit as { count: number; offset?: number }).offset !== undefined
                    ? ` (Offset ${(data.limit as { count: number; offset?: number }).offset})`
                    : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {type === 'outputNode' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Selected Projections</div>
            <div className={styles.codeBlock}>
              {Array.isArray(data.projections)
                ? (data.projections as Array<{ raw?: string; expr?: string; alias?: string }>)
                    .map((p) => p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*')
                    .join('\n')
                : '*'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
