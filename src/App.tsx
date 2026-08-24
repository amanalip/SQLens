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
      />

      <div className={styles.mainLayout}>
        {isLoadingDb && (
          <div className={styles.loadingOverlay}>
            <span>Loading SQLite database into WebAssembly memory...</span>
          </div>
        )}

        {mode === 'query' && (
          <div className={styles.leftColumn}>
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
              />
            </div>
            <DiagnosticsBar
              diagnostics={parseResult.diagnostics}
              onJumpToLine={handleJumpToLine}
            />
            <div className={styles.resultsSection}>
              <ResultsTable result={queryResult} error={executionError} />
            </div>
          </div>
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
