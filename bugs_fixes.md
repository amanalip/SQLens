# Bug Fixes & Code Quality Log

## 1. JOIN USING Column Reference Extraction Bug

- **Issue**: In `src/parser/queryAnalyzer.ts`, `item.using.map(String)` converted column reference AST objects (`{ type: 'column_ref', column: 'id' }`) into `'[object Object]'` instead of extracting the column name.
- **Fix**: Updated extraction to resolve `column`, `value`, or `exprToString()` from AST objects.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`
  - `tests/parser.test.ts`

---

## 2. JoinNode Empty usingColumns False-Positive Guard

- **Issue**: In `src/graph/nodes/JoinNode.tsx`, `{joinData.usingColumns && ...}` evaluated to true on empty arrays (`[]`), rendering `USING ()` and masking Cartesian product warnings.
- **Fix**: Guarded with `joinData.usingColumns && joinData.usingColumns.length > 0`.
- **Files Modified**:
  - `src/graph/nodes/JoinNode.tsx`

---

## 3. ErrorBoundary Session Reset Recovery Option

- **Issue**: When an uncaught exception occurred (such as corrupted localStorage or malformed URL hashes), `ErrorBoundary.tsx` only provided a simple reload button, which could cause an infinite reload loop.
- **Fix**: Added a secondary "Reset Session" button that clears URL hashes, resets theme storage, and restores default application state.
- **Files Modified**:
  - `src/ErrorBoundary.tsx`

---

## 4. CTESubgraphNode Target Handle for Chained Sub-Pipelines

- **Issue**: `CTESubgraphNode.tsx` only provided a source handle, preventing visual chaining between upstream and downstream CTE blocks.
- **Fix**: Added target `<Handle>` to `CTESubgraphNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/CTESubgraphNode.tsx`

---

## 5. Help Dialog Keyboard Dismissal on Escape

- **Issue**: The Help & Keyboard Shortcuts modal in `TopNav.tsx` had no keyboard listener, requiring users to manually click the backdrop or close button to dismiss it.
- **Fix**: Added a dedicated `useEffect` listener to dismiss the modal when pressing the `Escape` key.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`

---

## 6. Window Resize Diagram Auto-Fit

- **Issue**: When resizing the browser window, toggling fullscreen, or docking browser developer tools, `QueryFlowCanvas.tsx` and `SchemaFlowCanvas.tsx` did not adjust their viewports, causing graphs to be off-center or clipped.
- **Fix**: Added a window `resize` event listener with debounced `fitView` centering.
- **Files Modified**:
  - `src/graph/QueryFlowCanvas.tsx`
  - `src/graph/SchemaFlowCanvas.tsx`

---

## 7. Query Diagnostics for Random Sorting & Redundant Distinct

- **Issue**: `ORDER BY RANDOM()` and `SELECT DISTINCT` combined with `GROUP BY` were not flagged in the query analyzer, missing critical performance diagnostic warnings.
- **Fix**: Added performance rules for random sorting (`ORDER BY RAND() / RANDOM()`) and redundant `SELECT DISTINCT ... GROUP BY`.
- **Files Modified**:
  - `src/parser/parser.ts`
  - `tests/diagnostics.test.ts`

---

## 8. TableNode Target Handle for CTE Ingress Connections

- **Issue**: `TableNode.tsx` only defined a right source handle, preventing incoming edges from Common Table Expressions (CTEs) or subqueries from docking on the left of table nodes.
- **Fix**: Added target `<Handle>` component on the left side of `TableNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/TableNode.tsx`

---

## 9. Diagnostics Bar Line 0 Rendering Bug

- **Issue**: In `DiagnosticsBar.tsx`, `{d.line && <span className={styles.badge}>Line {d.line}</span>}` rendered the raw number `0` in the DOM when `d.line === 0`.
- **Fix**: Added a strict guard `{typeof d.line === 'number' && d.line > 0 && ...}`.
- **Files Modified**:
  - `src/ui/DiagnosticsBar/DiagnosticsBar.tsx`

---

## 10. Results Table CSV Export Type Serialization

- **Issue**: Boolean, null, and object values in query results were serialized as unquoted or poorly formatted string representations in `generateCsv()`.
- **Fix**: Added type-aware CSV serialization handling numbers, `TRUE`/`FALSE` booleans, escaped JSON objects, and empty null cells.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/export.test.ts`

---

## 11. Concurrent SqlEngineClient Initialization Race Condition

- **Issue**: `SqlEngineClient.init()` lacked initialization promise caching, causing concurrent callers during startup or database switching to instantiate multiple Web Workers and overwrite pending request maps.
- **Fix**: Cached `initPromise` until initialization resolves, ensuring all concurrent callers await the same Web Worker instance.
- **Files Modified**:
  - `src/engine/client.ts`

---

## 12. Stale Callback Closure in CodeMirror Keymaps

- **Issue**: `Mod-Enter` (`onRunQuery`) and `updateListener` (`onChange`) in `EditorPane.tsx` captured initial closures from `useEffect(..., [])`, invoking stale props when parent state updated.
- **Fix**: Wrapped callbacks in mutable refs (`onRunQueryRef` and `onChangeRef`).
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 13. URL Hash State Hydration Flash

- **Issue**: `selectedDbId`, `sqlQuery`, and `mode` initialized with hardcoded defaults before reading the URL hash, causing a brief flash and state replacement.
- **Fix**: Lazily initialized state from `decodeStateFromHash(window.location.hash)`.
- **Files Modified**:
  - `src/App.tsx`

---

## 14. Cursor Position Reset on SQL Formatter

- **Issue**: Running the format action in `EditorPane.tsx` dispatched document changes without preserving selection, resetting the cursor to index 0.
- **Fix**: Preserved the main selection head offset during dispatch and clamped to the formatted document length.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 15. Handle ID Collisions in React Flow Schema Cards

- **Issue**: Source and target handles on each column row shared the same identifier string (`${table.name}_${col.name}`), causing handle registry collisions and incorrect edge routing in React Flow.
- **Fix**: Suffix target handle IDs with `_target` and source handle IDs with `_source`. Updated `src/layout/schemaLayout.ts` to reference `sourceHandle: ${fk.fromTable}_${fk.fromColumn}_source` and `targetHandle: ${fk.toTable}_${fk.toColumn}_target`.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/layout/schemaLayout.ts`

---

## 16. Schema Parser Multi-Word Data Types

- **Issue**: The column definition regex in `src/parser/schemaParser.ts` truncated multi-word SQL data types (such as `DOUBLE PRECISION`, `INT UNSIGNED`, `CHARACTER VARYING(500)`), causing the second word to be treated as a column constraint.
- **Fix**: Replaced regex matching with keyword boundary scanning that separates the column data type from constraint keywords (`PRIMARY KEY`, `NOT NULL`, `DEFAULT`, `REFERENCES`, `CHECK`).
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaParser.test.ts`

---

## 17. Stale Error State on Database and Sample Selection

- **Issue**: When an invalid query triggered an execution error in `App.tsx`, selecting a new sample query or changing databases cleared `queryResult` but left `executionError` intact, preventing automatic execution of clean sample queries.
- **Fix**: Cleared `setExecutionError(null)` in `handleDbChange` and `handleSelectSample`.
- **Files Modified**:
  - `src/App.tsx`

---

## 18. Theme Mismatch in Graph PNG Export

- **Issue**: `src/graph/export.ts` hardcoded `#0f141c` as the PNG canvas background color, creating dark backgrounds for diagrams exported during light mode.
- **Fix**: Dynamically resolve the computed value of CSS variable `--bg-primary` before generating image export.
- **Files Modified**:
  - `src/graph/export.ts`

---

## 19. Resilient URL Hash State Decoding

- **Issue**: URL hashes modified by browser encoding (e.g. percent-encoding) failed to decompress in `src/share/urlState.ts`.
- **Fix**: Added sanitization and fallback decoding with `decodeURIComponent` before decompression.
- **Files Modified**:
  - `src/share/urlState.ts`
  - `tests/urlState.test.ts`

---

## 20. SQLite Foreign Key Null Target Column Resolution

- **Issue**: When a SQLite foreign key referenced a table's primary key without an explicit column name, `PRAGMA foreign_key_list` returned null for the target column, resulting in the literal string `"null"` and broken edge connections.
- **Fix**: Added fallback to default primary key column name (`'id'`) when `fkRow[4]` is null or empty.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 21. Web Worker SQLite Index Extraction & Missing FK Index Warnings

- **Issue**: `GET_SCHEMA` in `src/engine/worker.ts` never queried `PRAGMA index_list` or `PRAGMA index_info`, leaving table indexes empty and missing index diagnostics unpopulated.
- **Fix**: Extracted real indexes via `PRAGMA index_list` and `PRAGMA index_info` per table and computed missing index warnings for foreign key columns.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 22. CTE Flow Edges in Query Graph

- **Issue**: CTE nodes were rendered on the canvas but had no outgoing edges connecting them to the downstream table source nodes referencing that CTE.
- **Fix**: Added directed flow edges from CTE nodes to matching source table nodes in `src/layout/queryLayout.ts`.
- **Files Modified**:
  - `src/layout/queryLayout.ts`
  - `tests/queryLayout.test.ts`

---

## 23. CTE Node Inspector in DetailsPanel

- **Issue**: Clicking on a CTE node in the query flow graph showed an empty inspector state.
- **Fix**: Added dedicated CTE node inspection displaying the CTE name, source tables, projections, and AST details.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 24. Zero-Column Query Feedback in Results Table

- **Issue**: When a query returned zero columns (e.g. DDL / DML commands), `ResultsTable.tsx` displayed the placeholder message "Execute query (Ctrl+Enter) to view results table".
- **Fix**: Added a success state that displays execution time and zero row feedback for non-result queries.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`

---

## UI/UX Enhancements Added

1. **Session Reset Option in Error Boundary**: Recovery button allows users to reset broken state or corrupted hash parameters.
2. **Chained CTE Ingress Ports**: Visual connection ports allow chaining between sub-pipelines.
3. **Modal Keyboard Dismissal**: Pressing `Escape` closes the Help and Keyboard Shortcuts modal from anywhere in the app.
4. **Dynamic Canvas Auto-Centering**: Resizing the window or toggling full screen automatically triggers a smooth graph re-center.
5. **Advanced Performance Diagnostics**: Visual diagnostics warn about `ORDER BY RANDOM()` and redundant `DISTINCT` + `GROUP BY` patterns.
6. **Target Handle Docking on Table Nodes**: Visual connections from CTEs and subqueries dock directly into source table cards.
7. **Query Clear & Reset Button**: Dedicated Clear button in `EditorPane.tsx` to clear editor queries with one click.
8. **Global Escape Key Dismissal**: `Escape` key listener in `src/App.tsx` to dismiss open node inspection drawers.
9. **Cursor-Preserving Formatter**: Formatter maintains cursor and line position during keyword formatting.
10. **Interactive Table Filter in Schema Explorer**: Real-time table search input in `SchemaFlowCanvas.tsx` to highlight matching tables and dim non-matching tables.
11. **Download CSV & Page Size Controls**: "Download CSV" file export button and a page size selector (10, 25, 50, 100 rows per page) in `ResultsTable.tsx`.
12. **Active Sort Direction Indicators**: Ascending (`ArrowUp`), descending (`ArrowDown`), and unsorted (`ArrowUpDown`) icons in results table headers.
13. **Keyboard Shortcuts & Help Dialog**: Help modal in `TopNav.tsx` detailing key shortcuts (`Ctrl+Enter` to run, `Ctrl+Space` for autocomplete, node click inspection).
14. **Dedicated Sort & Limit Inspector**: Full inspection for `ORDER BY` directions and `LIMIT / OFFSET` numbers in `DetailsPanel.tsx`.

---

## Expanded Test Coverage (11 Test Suites, 47 Tests)

- `tests/parser.test.ts`: Query parsing, USING clauses, multiple CTEs, comments handling, empty query handling, and AST models.
- `tests/diagnostics.test.ts`: Diagnostics for unbounded mutations, Cartesian joins, star projections, leading wildcards, random sorting, redundant distinct, syntax errors.
- `tests/export.test.ts`: CSV generator logic with nulls, booleans, objects, quotes, and multi-row datasets.
- `tests/databaseCatalog.test.ts`: Verifies all 23 database sample queries parse without syntax errors.
- `tests/theme.test.ts`: Validates light and dark theme palettes, contrast, and CSS variables.
- `tests/schemaLayout.test.ts`: Graph layout, distinct handle IDs, orphan tables.
- `tests/dialects.test.ts`: Dialect detection for PostgreSQL, MySQL, and SQLite.
- `tests/queryAnalyzer.test.ts`: AST analysis for CTEs, joins, aggregations, subqueries in FROM, order by, limit.
- `tests/schemaParser.test.ts`: Multi-word data types, composite primary keys, foreign keys, missing indexes.
- `tests/urlState.test.ts`: Codec encoding, hash prefixes, corruption handling.
- `tests/queryLayout.test.ts`: Query flow DAG layout, CTE connections, dual table support.
