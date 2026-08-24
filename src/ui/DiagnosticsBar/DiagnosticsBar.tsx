import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { DiagnosticWarning } from '../../model/diagnostics';
import styles from './DiagnosticsBar.module.css';

interface DiagnosticsBarProps {
  diagnostics: DiagnosticWarning[];
  onJumpToLine?: (line: number, column?: number) => void;
}

export const DiagnosticsBar: React.FC<DiagnosticsBarProps> = ({
  diagnostics,
  onJumpToLine,
}) => {
  if (diagnostics.length === 0) {
    return (
      <div className={styles.bar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981' }}>
          <CheckCircle size={13} />
          <span>Query syntax clean</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bar}>
      {diagnostics.map((d, index) => {
        const isError = d.severity === 'error';
        const isWarning = d.severity === 'warning';
        const itemClass = isError
          ? styles.error
          : isWarning
          ? styles.warning
          : styles.info;

        const hasLine = typeof d.line === 'number' && d.line > 0;
        return (
          <div
            key={`${d.id}_${index}`}
            className={`${styles.item} ${itemClass}`}
            role={hasLine ? 'button' : undefined}
            tabIndex={hasLine ? 0 : undefined}
            onClick={() => {
              if (hasLine && onJumpToLine) {
                onJumpToLine(Math.max(1, d.line!), d.column);
              }
            }}
            onKeyDown={(e) => {
              if (hasLine && onJumpToLine && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onJumpToLine(Math.max(1, d.line!), d.column);
              }
            }}
            style={{ cursor: hasLine ? 'pointer' : 'default' }}
            title={
              d.suggestion
                ? `${d.suggestion}${hasLine ? ' (Click or press Enter to jump to line)' : ''}`
                : hasLine
                ? 'Click or press Enter to jump to line in editor'
                : undefined
            }
          >
            {isError ? (
              <AlertCircle size={12} />
            ) : isWarning ? (
              <AlertTriangle size={12} />
            ) : (
              <Info size={12} />
            )}
            {hasLine && <span className={styles.badge}>Line {d.line}</span>}
            <span className={styles.message}>{d.message}</span>
          </div>
        );
      })}
    </div>
  );
};
