import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TopNav } from './ui/TopNav/TopNav';
import { EditorPane, EditorPaneRef } from './ui/EditorPane/EditorPane';
import { DiagnosticsBar } from './ui/DiagnosticsBar/DiagnosticsBar';
import { ResultsTable } from './ui/ResultsTable/ResultsTable';
import { DetailsPanel } from './ui/DetailsPanel/DetailsPanel';
import { QueryFlowCanvas } from './graph/QueryFlowCanvas';
import { SchemaFlowCanvas } from './graph/SchemaFlowCanvas';
import { parseSQL } from './parser/parser';
import { sqlEngine } from './engine/client';
import { QueryExecutionResult } from './engine/worker';
import { SchemaModel } from './model/schema';
import { bundledDatabases, SampleQuery } from './samples';
import { Theme, themes } from './theme';
import { decodeStateFromHash, encodeStateToHash } from './share/urlState';
import { exportGraphToPng } from './graph/export';
import styles from './App.module.css';

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sqlens_theme') as Theme) || 'dark';
  });

  const initialHashState = useMemo(() => {
    return decodeStateFromHash(window.location.hash);
  }, []);

  const [mode, setMode] = useState<'query' | 'schema'>(() => initialHashState?.mode || 'query');
  const [selectedDbId, setSelectedDbId] = useState<string>(() => initialHashState?.dbId || 'chinook');
  const [sqlQuery, setSqlQuery] = useState<string>(() => {
    return initialHashState?.sql || bundledDatabases[0].samples[0]?.sql || 'SELECT 1;';
  });

  const [schema, setSchema] = useState<SchemaModel | null>(null);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const [selectedNode, setSelectedNode] = useState<{
    type?: string;
    data: Record<string, unknown>;
  } | null>(null);

  // Resizable layout states
  const [editorWidth, setEditorWidth] = useState<number>(() => {
    const saved = localStorage.getItem('sqlens_editor_width');
    return saved ? Math.max(280, Math.min(parseInt(saved, 10), 1200)) : 480;
  });
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);

  const [resultsHeight, setResultsHeight] = useState<number>(() => {
    const saved = localStorage.getItem('sqlens_results_height');
    return saved ? Math.max(80, Math.min(parseInt(saved, 10), 600)) : 240;
  });
  const [isResizingVertical, setIsResizingVertical] = useState(false);

  const startHorizontalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingHorizontal(true);
  }, []);

  const startVerticalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingVertical(true);
  }, []);

  const handleToggleExpandEditor = useCallback(() => {
    setEditorWidth((prev) => {
      const next = prev >= 650 ? 480 : Math.min(800, window.innerWidth - 350);
      localStorage.setItem('sqlens_editor_width', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isResizingHorizontal && !isResizingVertical) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHorizontal) {
        const maxWidth = Math.max(400, window.innerWidth - 300);
        const newWidth = Math.max(280, Math.min(e.clientX, maxWidth));
        setEditorWidth(newWidth);
        localStorage.setItem('sqlens_editor_width', String(newWidth));
      }
      if (isResizingVertical) {
        const maxHeight = Math.max(200, window.innerHeight - 250);
        const newHeight = Math.max(80, Math.min(window.innerHeight - e.clientY, maxHeight));
        setResultsHeight(newHeight);
        localStorage.setItem('sqlens_results_height', String(newHeight));
      }
    };

    const handleMouseUp = () => {
      setIsResizingHorizontal(false);
      setIsResizingVertical(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingHorizontal, isResizingVertical]);

  const editorRef = useRef<EditorPaneRef>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Global Escape key listener to close details drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply theme tokens to CSS root variables
  useEffect(() => {
    const currentTokens = themes[theme];
    const root = document.documentElement;

    root.style.setProperty('--bg-primary', currentTokens.bgPrimary);
    root.style.setProperty('--bg-secondary', currentTokens.bgSecondary);
    root.style.setProperty('--bg-tertiary', currentTokens.bgTertiary);
    root.style.setProperty('--bg-card', currentTokens.bgCard);
    root.style.setProperty('--border', currentTokens.border);
    root.style.setProperty('--border-subtle', currentTokens.borderSubtle);
    root.style.setProperty('--text-primary', currentTokens.textPrimary);
    root.style.setProperty('--text-secondary', currentTokens.textSecondary);
    root.style.setProperty('--text-muted', currentTokens.textMuted);
    root.style.setProperty('--accent', currentTokens.accent);
    root.style.setProperty('--accent-hover', currentTokens.accentHover);
    root.style.setProperty('--accent-muted', currentTokens.accentMuted);
    root.style.setProperty('--success', currentTokens.success);
    root.style.setProperty('--warning', currentTokens.warning);
    root.style.setProperty('--error', currentTokens.error);
    root.style.setProperty('--node-table', currentTokens.nodeTable);
    root.style.setProperty('--node-join', currentTokens.nodeJoin);
    root.style.setProperty('--node-filter', currentTokens.nodeFilter);
    root.style.setProperty('--node-aggregate', currentTokens.nodeAggregate);
    root.style.setProperty('--node-sort', currentTokens.nodeSort);
    root.style.setProperty('--node-output', currentTokens.nodeOutput);
    root.style.setProperty('--node-cte', currentTokens.nodeCte);

    localStorage.setItem('sqlens_theme', theme);
  }, [theme]);

  // Load database on selection or initial mount
  const loadDatabase = useCallback(async (dbId: string) => {
    setIsLoadingDb(true);
    try {
      const dbConfig = bundledDatabases.find((db) => db.id === dbId) || bundledDatabases[0];
      await sqlEngine.loadDatabase(dbConfig.filename);
      const extractedSchema = await sqlEngine.getSchema();
      setSchema(extractedSchema);
    } catch (err) {
      console.error('Failed to load database:', err);
    } finally {
      setIsLoadingDb(false);
    }
  }, []);

  // Parse SQL into AST and diagnostics
  const parseResult = useMemo(() => {
    return parseSQL(sqlQuery);
  }, [sqlQuery]);

  // Execute query against Web Worker SQLite engine
  const handleRunQuery = useCallback(async () => {
    if (!sqlQuery.trim()) return;

    setIsExecuting(true);
    setExecutionError(null);

    try {
      const res = await sqlEngine.executeQuery(sqlQuery);
      setQueryResult(res);

      // Auto-refresh schema if a mutation or DDL query was run
      if (/^\s*(create|alter|drop|insert|update|delete|attach|detach)\b/i.test(sqlQuery)) {
        try {
          const updatedSchema = await sqlEngine.getSchema();
          setSchema(updatedSchema);
        } catch {
          // Schema refresh optional
        }
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setExecutionError(errorObj.message || 'Execution failed');
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  }, [sqlQuery]);

  // Initialize initial database
  useEffect(() => {
    const targetDb = initialHashState?.dbId || 'chinook';
    loadDatabase(targetDb);
  }, [loadDatabase, initialHashState]);

  // Auto-run query once when database finishes loading
  useEffect(() => {
    if (schema && !queryResult && !executionError) {
      handleRunQuery();
    }
  }, [schema, queryResult, executionError, handleRunQuery]);

  const handleDbChange = (newDbId: string) => {
    setSelectedDbId(newDbId);
    setQueryResult(null);
    setExecutionError(null);
    loadDatabase(newDbId);
    const dbConfig = bundledDatabases.find((db) => db.id === newDbId);
    if (dbConfig && dbConfig.samples[0]) {
      setSqlQuery(dbConfig.samples[0].sql);
      editorRef.current?.setValue(dbConfig.samples[0].sql);
    }
  };

  const handleUploadDatabase = async (file: File) => {
    setIsLoadingDb(true);
    setExecutionError(null);
    try {
      const buffer = await file.arrayBuffer();
      await sqlEngine.loadDatabaseBuffer(buffer);
      const extractedSchema = await sqlEngine.getSchema();
      setSchema(extractedSchema);
      setSelectedDbId('custom');
      const firstTableName = Object.keys(extractedSchema.tables)[0];
      if (firstTableName) {
        const defaultSql = `SELECT * FROM ${firstTableName} LIMIT 25;`;
        setSqlQuery(defaultSql);
        editorRef.current?.setValue(defaultSql);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setExecutionError(error.message || 'Failed to upload database');
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleSelectSample = (sample: SampleQuery) => {
    setSqlQuery(sample.sql);
    editorRef.current?.setValue(sample.sql);
    setQueryResult(null);
    setExecutionError(null);
  };

  const handleShare = () => {
    const hash = encodeStateToHash({
      sql: sqlQuery,
      dbId: selectedDbId,
      mode,
    });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    window.location.hash = hash;
  };

  const handleExportPng = () => {
    if (canvasRef.current) {
      const filename = mode === 'query' ? `sqlens-query-${selectedDbId}.png` : `sqlens-schema-${selectedDbId}.png`;
      exportGraphToPng(canvasRef.current, filename);
    }
  };

  const handleJumpToLine = (line: number, col?: number) => {
    editorRef.current?.jumpToLine(line, col);
  };

  return (
    <div className={styles.appContainer}>
      <TopNav
        mode={mode}
        onModeChange={setMode}
        selectedDbId={selectedDbId}
        onDbChange={handleDbChange}
        onSelectSample={handleSelectSample}
        onExportPng={handleExportPng}
        onShare={handleShare}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        isLoadingDb={isLoadingDb}
        onUploadDatabase={handleUploadDatabase}
      />

      <div className={styles.mainLayout}>
        {isLoadingDb && (
          <div className={styles.loadingOverlay}>
            <span>Loading SQLite database into WebAssembly memory...</span>
          </div>
        )}

        {mode === 'query' && (
          <>
            <div className={styles.leftColumn} style={{ width: editorWidth }}>
              <div className={styles.editorSection}>
                <EditorPane
                  ref={editorRef}
                  value={sqlQuery}
                  onChange={setSqlQuery}
                  onRunQuery={handleRunQuery}
                  diagnostics={parseResult.diagnostics}
                  schema={schema || undefined}
                  theme={theme}
                  isExecuting={isExecuting}
                  isExpanded={editorWidth >= 650}
                  onToggleExpand={handleToggleExpandEditor}
                />
              </div>
              <DiagnosticsBar
                diagnostics={parseResult.diagnostics}
                onJumpToLine={handleJumpToLine}
              />
              <div
                className={`${styles.resizerVertical} ${isResizingVertical ? styles.resizing : ''}`}
                onMouseDown={startVerticalResize}
                title="Drag to resize results / editor height"
              />
              <div className={styles.resultsSection} style={{ height: resultsHeight }}>
                <ResultsTable
                  result={queryResult}
                  error={executionError}
                  isExecuting={isExecuting}
                  onClear={() => {
                    setQueryResult(null);
                    setExecutionError(null);
                  }}
                />
              </div>
            </div>
            <div
              className={`${styles.resizerHorizontal} ${isResizingHorizontal ? styles.resizing : ''}`}
              onMouseDown={startHorizontalResize}
              title="Drag to resize editor pane width"
            />
          </>
        )}

        <div className={styles.canvasColumn} ref={canvasRef}>
          {mode === 'query' ? (
            <QueryFlowCanvas
              model={parseResult.model}
              theme={theme}
              onSelectNode={(nodeData, nodeType) => {
                if (nodeData) {
                  setSelectedNode({ data: nodeData, type: nodeType });
                } else {
                  setSelectedNode(null);
                }
              }}
            />
          ) : (
            schema && (
              <SchemaFlowCanvas
                schema={schema}
                theme={theme}
                onSelectTable={(tableData) => {
                  if (tableData) {
                    setSelectedNode({ data: tableData, type: 'tableCardNode' });
                  } else {
                    setSelectedNode(null);
                  }
                }}
              />
            )
          )}
        </div>

        <DetailsPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}
