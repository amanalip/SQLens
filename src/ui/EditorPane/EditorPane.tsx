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
import { Play, Upload, Sparkles } from 'lucide-react';
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
}

export const EditorPane = forwardRef<EditorPaneRef, EditorPaneProps>(
  ({ value, onChange, onRunQuery, diagnostics, schema, theme = 'dark', isExecuting = false }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const schemaCompartment = useRef(new Compartment());
    const themeCompartment = useRef(new Compartment());
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      jumpToLine: (line: number, column = 1) => {
        const view = editorViewRef.current;
        if (!view) return;
        try {
          const doc = view.state.doc;
          const targetLine = Math.min(Math.max(1, line), doc.lines);
          const lineObj = doc.line(targetLine);
          const targetPos = Math.min(lineObj.from + (column - 1), lineObj.to);

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
            onRunQuery();
            return true;
          },
        },
      ]);

      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const docString = update.state.doc.toString();
          onChange(docString);
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
          updateListener,
          EditorView.theme({
            '&': {
              height: '100%',
              backgroundColor: 'var(--bg-secondary, #161d27)',
              color: 'var(--text-primary, #f3f4f6)',
            },
            '.cm-content': {
              caretColor: 'var(--accent, #3b82f6)',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: '8px 0',
            },
            '.cm-gutters': {
              backgroundColor: 'var(--bg-primary, #0f141c)',
              color: 'var(--text-muted, #6b7280)',
              borderRight: '1px solid var(--border, #2a3649)',
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

    // Format SQL query helper
    const handleFormat = () => {
      const view = editorViewRef.current;
      if (!view) return;
      const sqlText = view.state.doc.toString();
      // Basic standard formatting indentation
      const formatted = sqlText
        .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|WITH)\b/gi, '\n$1')
        .replace(/\s+/g, ' ')
        .replace(/\n\s+/g, '\n')
        .trim();

      view.dispatch({
        changes: { from: 0, to: sqlText.length, insert: formatted },
      });
      onChange(formatted);
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
          onChange(text);
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
              title="Format query keywords"
            >
              <Sparkles size={13} />
              <span>Format</span>
            </button>

            <button
              className={styles.toolButton}
              onClick={() => fileInputRef.current?.click()}
              title="Upload .sql file"
            >
              <Upload size={13} />
              <span>Open</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".sql,.txt"
              onChange={handleFileUpload}
            />

            <button
              className={styles.runButton}
              onClick={onRunQuery}
              disabled={isExecuting}
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
