import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { sql, SQLite } from '@codemirror/lang-sql';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { setDiagnostics, Diagnostic } from '@codemirror/lint';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, Upload, Sparkles, RotateCcw, Maximize2, Minimize2, WrapText } from 'lucide-react';
import { DiagnosticWarning } from '../../model/diagnostics';
import { SchemaModel } from '../../model/schema';
import styles from './EditorPane.module.css';

export interface EditorPaneRef {
  jumpToLine: (line: number, column?: number) => void;
  setValue: (sql: string) => void;
  getValue: () => string;
}

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onRunQuery: () => void;
  diagnostics: DiagnosticWarning[];
  schema?: SchemaModel;
  theme?: 'dark' | 'light';
  isExecuting?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const EditorPane = forwardRef<EditorPaneRef, EditorPaneProps>(
  ({ value, onChange, onRunQuery, diagnostics, schema, theme = 'dark', isExecuting = false, isExpanded = false, onToggleExpand }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const schemaCompartment = useRef(new Compartment());
    const themeCompartment = useRef(new Compartment());
    const wrappingCompartment = useRef(new Compartment());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isWrapping, setIsWrapping] = React.useState(() => {
      return localStorage.getItem('sqlens_editor_wrap') !== 'false';
    });

    const onRunQueryRef = useRef(onRunQuery);
    onRunQueryRef.current = onRunQuery;

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useImperativeHandle(ref, () => ({
      jumpToLine: (line: number, column = 1) => {
        const view = editorViewRef.current;
        if (!view) return;
        try {
          const doc = view.state.doc;
          const targetLine = Math.min(Math.max(1, line), doc.lines);
          const lineObj = doc.line(targetLine);
          const safeColumn = Math.max(1, column);
          const targetPos = Math.min(lineObj.from + (safeColumn - 1), lineObj.to);

          view.dispatch({
            selection: { anchor: targetPos, head: targetPos },
            scrollIntoView: true,
          });
          view.focus();
        } catch {
          // Ignore range error if doc is shorter
        }
      },
      setValue: (newSql: string) => {
        const view = editorViewRef.current;
        if (!view) return;
        const currentDoc = view.state.doc.toString();
        if (currentDoc !== newSql) {
          view.dispatch({
            changes: { from: 0, to: currentDoc.length, insert: newSql },
          });
        }
      },
      getValue: () => {
        return editorViewRef.current ? editorViewRef.current.state.doc.toString() : value;
      },
    }));

    // Initialize CodeMirror instance
    useEffect(() => {
      if (!editorContainerRef.current) return;

      // Extract autocomplete tables & columns schema map
      const schemaMap: Record<string, string[]> = {};
      if (schema?.tables) {
        Object.values(schema.tables).forEach((t) => {
          schemaMap[t.name] = t.columns.map((c) => c.name);
        });
      }

      const runKeymap = keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            onRunQueryRef.current();
            return true;
          },
        },
      ]);

      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const docString = update.state.doc.toString();
          onChangeRef.current(docString);
        }
      });

      const state = EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          closeBrackets(),
          autocompletion(),
          runKeymap,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          schemaCompartment.current.of(
            sql({
              dialect: SQLite,
              schema: schemaMap,
              upperCaseKeywords: true,
            })
          ),
          themeCompartment.current.of(theme === 'dark' ? oneDark : []),
          wrappingCompartment.current.of(isWrapping ? EditorView.lineWrapping : []),
          updateListener,
          EditorView.theme({
            '&': {
              height: '100%',
              backgroundColor: 'var(--bg-card, #1a222f)',
              color: 'var(--text-primary, #f3f4f6)',
            },
            '.cm-content': {
              caretColor: 'var(--accent, #3b82f6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13.5px',
              fontWeight: '500',
              lineHeight: '1.55',
              padding: '10px 0',
            },
            '.cm-gutters': {
              backgroundColor: 'var(--bg-secondary, #161d27)',
              color: 'var(--text-secondary, #9ca3af)',
              borderRight: '1px solid var(--border, #2a3649)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            },
            '.cm-activeLine': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
            '.cm-activeLineGutter': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorContainerRef.current,
      });

      editorViewRef.current = view;

      return () => {
        view.destroy();
      };
    }, []);

    // Update schema autocomplete when schema changes
    useEffect(() => {
      const view = editorViewRef.current;
      if (!view) return;

      const schemaMap: Record<string, string[]> = {};
      if (schema?.tables) {
        Object.values(schema.tables).forEach((t) => {
          schemaMap[t.name] = t.columns.map((c) => c.name);
        });
      }

      view.dispatch({
        effects: schemaCompartment.current.reconfigure(
          sql({
            dialect: SQLite,
            schema: schemaMap,
            upperCaseKeywords: true,
          })
        ),
      });
    }, [schema]);

    // Update theme when theme changes
    useEffect(() => {
      const view = editorViewRef.current;
      if (!view) return;

      view.dispatch({
        effects: themeCompartment.current.reconfigure(theme === 'dark' ? oneDark : []),
      });
    }, [theme]);

    // Update external value changes if not in focus
    useEffect(() => {
      const view = editorViewRef.current;
      if (!view) return;
      const currentDoc = view.state.doc.toString();
      if (value !== currentDoc && !view.hasFocus) {
        view.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        });
      }
    }, [value]);

    // Update lint diagnostics in editor
    useEffect(() => {
      const view = editorViewRef.current;
      if (!view) return;

      const doc = view.state.doc;
      const cmDiagnostics: Diagnostic[] = diagnostics
        .filter((d) => d.line !== undefined)
        .map((d) => {
          const lineNum = Math.min(Math.max(1, d.line || 1), doc.lines);
          const lineObj = doc.line(lineNum);
          return {
            from: lineObj.from,
            to: lineObj.to,
            severity: d.severity === 'error' ? 'error' : d.severity === 'warning' ? 'warning' : 'info',
            message: d.message,
          };
        });

      view.dispatch(setDiagnostics(view.state, cmDiagnostics));
    }, [diagnostics]);

    const [copiedSql, setCopiedSql] = React.useState(false);

    // Format SQL query helper with string literal protection
    const handleFormat = () => {
      const view = editorViewRef.current;
      if (!view) return;
      const sqlText = view.state.doc.toString();
      if (!sqlText.trim()) return;

      // Extract and preserve single-quoted and double-quoted string literals
      const stringLiterals: string[] = [];
      const placeholder = (idx: number) => `__SQLENS_STR_LITERAL_${idx}__`;

      let protectedSql = sqlText.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"/g, (match) => {
        const idx = stringLiterals.length;
        stringLiterals.push(match);
        return placeholder(idx);
      });

      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
        'LIMIT', 'OFFSET', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
        'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR', 'UNION ALL',
        'UNION', 'WITH', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
        'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
      ];

      let formatted = protectedSql;

      // Uppercase standard keywords outside literals
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        formatted = formatted.replace(regex, kw);
      });

      // Insert clean clause newlines
      const majorClauses = [
        'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
        'LIMIT', 'OFFSET', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
        'FULL JOIN', 'CROSS JOIN', 'UNION ALL', 'UNION', 'WITH', 'SET', 'VALUES'
      ];

      majorClauses.forEach((clause) => {
        const regex = new RegExp(`\\s*\\b(${clause})\\b`, 'g');
        formatted = formatted.replace(regex, '\n$1');
      });

      // Restore string literals
      stringLiterals.forEach((literal, idx) => {
        formatted = formatted.replace(placeholder(idx), literal);
      });

      formatted = formatted.trim();

      const cursor = view.state.selection.main.head;

      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formatted },
        selection: { anchor: Math.min(cursor, formatted.length) },
      });
      onChangeRef.current(formatted);
    };

    // Clear editor content
    const handleClear = () => {
      const view = editorViewRef.current;
      if (!view) return;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '' },
      });
      onChangeRef.current('');
      view.focus();
    };

    // Copy SQL text
    const handleCopySql = () => {
      const view = editorViewRef.current;
      const textToCopy = view ? view.state.doc.toString() : value;
      if (!textToCopy) return;
      navigator.clipboard.writeText(textToCopy);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    };

    const handleToggleWrap = () => {
      const nextWrapping = !isWrapping;
      setIsWrapping(nextWrapping);
      localStorage.setItem('sqlens_editor_wrap', String(nextWrapping));

      editorViewRef.current?.dispatch({
        effects: wrappingCompartment.current.reconfigure(
          nextWrapping ? EditorView.lineWrapping : []
        ),
      });
    };

    // File upload handler
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const view = editorViewRef.current;
          if (view) {
            view.dispatch({
              changes: { from: 0, to: view.state.doc.length, insert: text },
            });
          }
          onChangeRef.current(text);
        }
      };
      reader.readAsText(file);
      if (event.target) event.target.value = '';
    };

    return (
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <span>SQL Query</span>
          <div className={styles.headerActions}>
            <button
              className={styles.toolButton}
              onClick={handleFormat}
              aria-label="Format SQL query"
              title="Format query keywords and clause structure"
            >
              <Sparkles size={13} />
              <span>Format</span>
            </button>

            <button
              className={styles.toolButton}
              onClick={handleCopySql}
              aria-label="Copy SQL query to clipboard"
              title="Copy SQL query"
            >
              <RotateCcw size={13} style={{ display: 'none' }} />
              <span>{copiedSql ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              className={styles.toolButton}
              onClick={handleClear}
              aria-label="Clear SQL editor"
              title="Clear editor query"
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>

            <button
              className={styles.toolButton}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Open SQL file"
              title="Upload .sql file"
            >
              <Upload size={13} />
              <span>Open</span>
            </button>

            <button
              className={`${styles.toolButton} ${isWrapping ? styles.activeToolButton : ''}`}
              onClick={handleToggleWrap}
              aria-label={isWrapping ? 'Disable SQL editor word wrap' : 'Enable SQL editor word wrap'}
              aria-pressed={isWrapping}
              title={isWrapping ? 'Disable word wrap' : 'Enable word wrap'}
            >
              <WrapText size={13} />
              <span>Wrap</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".sql,.txt"
              aria-label="Upload SQL file"
              onChange={handleFileUpload}
            />

            {onToggleExpand && (
              <button
                className={styles.toolButton}
                onClick={onToggleExpand}
                aria-label={isExpanded ? 'Collapse editor pane width' : 'Extend editor pane width'}
                title={isExpanded ? 'Collapse editor pane width (480px)' : 'Extend editor pane width (800px)'}
              >
                {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span>{isExpanded ? 'Collapse' : 'Extend'}</span>
              </button>
            )}

            <button
              className={styles.runButton}
              onClick={() => onRunQueryRef.current()}
              disabled={isExecuting}
              aria-label="Execute SQL query"
              title="Execute query (Ctrl+Enter)"
            >
              <Play size={13} fill="#ffffff" />
              <span>{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>
        <div className={styles.editorCanvas} ref={editorContainerRef} />
      </div>
    );
  }
);

EditorPane.displayName = 'EditorPane';
