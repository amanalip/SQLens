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

        return (
          <div
            key={`${d.id}_${index}`}
            className={`${styles.item} ${itemClass}`}
            onClick={() => {
              if (d.line && onJumpToLine) {
                onJumpToLine(d.line, d.column);
              }
            }}
            title={d.suggestion || 'Click to jump to line in editor'}
          >
            {isError ? (
              <AlertCircle size={12} />
            ) : isWarning ? (
              <AlertTriangle size={12} />
            ) : (
              <Info size={12} />
            )}
            {d.line && <span className={styles.badge}>Line {d.line}</span>}
            <span className={styles.message}>{d.message}</span>
          </div>
        );
      })}
    </div>
  );
};
