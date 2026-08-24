# Bug Fixes & Code Quality Log

## 1. TableNode Target Handle for CTE Ingress Connections

- **Issue**: `TableNode.tsx` only defined a right source handle, preventing incoming edges from Common Table Expressions (CTEs) or subqueries from docking on the left of table nodes.
- **Fix**: Added target `<Handle>` component on the left side of `TableNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/TableNode.tsx`

---

## 2. Diagnostics Bar Line 0 Rendering Bug

- **Issue**: In `DiagnosticsBar.tsx`, `{d.line && <span className={styles.badge}>Line {d.line}</span>}` rendered the raw number `0` in the DOM when `d.line === 0`.
- **Fix**: Added a strict guard `{typeof d.line === 'number' && d.line > 0 && ...}`.
- **Files Modified**:
  - `src/ui/DiagnosticsBar/DiagnosticsBar.tsx`

---

## 3. Results Table CSV Export Type Serialization

- **Issue**: Boolean, null, and object values in query results were serialized as unquoted or poorly formatted string representations in `generateCsv()`.
- **Fix**: Added type-aware CSV serialization handling numbers, `TRUE`/`FALSE` booleans, escaped JSON objects, and empty null cells.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/export.test.ts`

---

## 4. Concurrent SqlEngineClient Initialization Race Condition

- **Issue**: `SqlEngineClient.init()` lacked initialization promise caching, causing concurrent callers during startup or database switching to instantiate multiple Web Workers and overwrite pending request maps.
- **Fix**: Cached `initPromise` until initialization resolves, ensuring all concurrent callers await the same Web Worker instance.
- **Files Modified**:
  - `src/engine/client.ts`

---

## 5. Stale Callback Closure in CodeMirror Keymaps

- **Issue**: `Mod-Enter` (`onRunQuery`) and `updateListener` (`onChange`) in `EditorPane.tsx` captured initial closures from `useEffect(..., [])`, invoking stale props when parent state updated.
- **Fix**: Wrapped callbacks in mutable refs (`onRunQueryRef` and `onChangeRef`).
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 6. URL Hash State Hydration Flash

- **Issue**: `selectedDbId`, `sqlQuery`, and `mode` initialized with hardcoded defaults before reading the URL hash, causing a brief flash and state replacement.
- **Fix**: Lazily initialized state from `decodeStateFromHash(window.location.hash)`.
- **Files Modified**:
  - `src/App.tsx`

---

## 7. Cursor Position Reset on SQL Formatter

- **Issue**: Running the format action in `EditorPane.tsx` dispatched document changes without preserving selection, resetting the cursor to index 0.
- **Fix**: Preserved the main selection head offset during dispatch and clamped to the formatted document length.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 8. Handle ID Collisions in React Flow Schema Cards

- **Issue**: Source and target handles on each column row shared the same identifier string (`${table.name}_${col.name}`), causing handle registry collisions and incorrect edge routing in React Flow.
- **Fix**: Suffix target handle IDs with `_target` and source handle IDs with `_source`. Updated `src/layout/schemaLayout.ts` to reference `sourceHandle: ${fk.fromTable}_${fk.fromColumn}_source` and `targetHandle: ${fk.toTable}_${fk.toColumn}_target`.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/layout/schemaLayout.ts`

---

## 9. Schema Parser Multi-Word Data Types

- **Issue**: The column definition regex in `src/parser/schemaParser.ts` truncated multi-word SQL data types (such as `DOUBLE PRECISION`, `INT UNSIGNED`, `CHARACTER VARYING(500)`), causing the second word to be treated as a column constraint.
- **Fix**: Replaced regex matching with keyword boundary scanning that separates the column data type from constraint keywords (`PRIMARY KEY`, `NOT NULL`, `DEFAULT`, `REFERENCES`, `CHECK`).
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaParser.test.ts`

---

## 10. Stale Error State on Database and Sample Selection

- **Issue**: When an invalid query triggered an execution error in `App.tsx`, selecting a new sample query or changing databases cleared `queryResult` but left `executionError` intact, preventing automatic execution of clean sample queries.
- **Fix**: Cleared `setExecutionError(null)` in `handleDbChange` and `handleSelectSample`.
- **Files Modified**:
  - `src/App.tsx`

---

## 11. Theme Mismatch in Graph PNG Export

- **Issue**: `src/graph/export.ts` hardcoded `#0f141c` as the PNG canvas background color, creating dark backgrounds for diagrams exported during light mode.
- **Fix**: Dynamically resolve the computed value of CSS variable `--bg-primary` before generating image export.
- **Files Modified**:
  - `src/graph/export.ts`

---

## 12. Resilient URL Hash State Decoding

- **Issue**: URL hashes modified by browser encoding (e.g. percent-encoding) failed to decompress in `src/share/urlState.ts`.
- **Fix**: Added sanitization and fallback decoding with `decodeURIComponent` before decompression.
- **Files Modified**:
  - `src/share/urlState.ts`
  - `tests/urlState.test.ts`

---

## 13. SQLite Foreign Key Null Target Column Resolution

- **Issue**: When a SQLite foreign key referenced a table's primary key without an explicit column name, `PRAGMA foreign_key_list` returned null for the target column, resulting in the literal string `"null"` and broken edge connections.
- **Fix**: Added fallback to default primary key column name (`'id'`) when `fkRow[4]` is null or empty.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 14. Web Worker SQLite Index Extraction & Missing FK Index Warnings

- **Issue**: `GET_SCHEMA` in `src/engine/worker.ts` never queried `PRAGMA index_list` or `PRAGMA index_info`, leaving table indexes empty and missing index diagnostics unpopulated.
- **Fix**: Extracted real indexes via `PRAGMA index_list` and `PRAGMA index_info` per table and computed missing index warnings for foreign key columns.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 15. CTE Flow Edges in Query Graph

- **Issue**: CTE nodes were rendered on the canvas but had no outgoing edges connecting them to the downstream table source nodes referencing that CTE.
- **Fix**: Added directed flow edges from CTE nodes to matching source table nodes in `src/layout/queryLayout.ts`.
- **Files Modified**:
  - `src/layout/queryLayout.ts`
  - `tests/queryLayout.test.ts`

---

## 16. CTE Node Inspector in DetailsPanel

- **Issue**: Clicking on a CTE node in the query flow graph showed an empty inspector state.
- **Fix**: Added dedicated CTE node inspection displaying the CTE name, source tables, projections, and AST details.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 17. Zero-Column Query Feedback in Results Table

- **Issue**: When a query returned zero columns (e.g. DDL / DML commands), `ResultsTable.tsx` displayed the placeholder message "Execute query (Ctrl+Enter) to view results table".
- **Fix**: Added a success state that displays execution time and zero row feedback for non-result queries.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`

---

## UI/UX Enhancements Added

1. **Target Handle Docking on Table Nodes**: Visual connections from CTEs and subqueries dock directly into source table cards.
2. **Query Clear & Reset Button**: Dedicated Clear button in `EditorPane.tsx` to clear editor queries with one click.
3. **Global Escape Key Dismissal**: `Escape` key listener in `src/App.tsx` to dismiss open node inspection drawers.
4. **Cursor-Preserving Formatter**: Formatter maintains cursor and line position during keyword formatting.
5. **Interactive Table Filter in Schema Explorer**: Real-time table search input in `SchemaFlowCanvas.tsx` to highlight matching tables and dim non-matching tables.
6. **Download CSV & Page Size Controls**: "Download CSV" file export button and a page size selector (10, 25, 50, 100 rows per page) in `ResultsTable.tsx`.
7. **Active Sort Direction Indicators**: Ascending (`ArrowUp`), descending (`ArrowDown`), and unsorted (`ArrowUpDown`) icons in results table headers.
8. **Keyboard Shortcuts & Help Dialog**: Help modal in `TopNav.tsx` detailing key shortcuts (`Ctrl+Enter` to run, `Ctrl+Space` for autocomplete, node click inspection).
9. **Dedicated Sort & Limit Inspector**: Full inspection for `ORDER BY` directions and `LIMIT / OFFSET` numbers in `DetailsPanel.tsx`.

---

## Expanded Test Coverage (11 Test Suites, 43 Tests)

- `tests/export.test.ts`: CSV generator logic with nulls, booleans, objects, quotes, and multi-row datasets.
- `tests/databaseCatalog.test.ts`: Verifies all 23 database sample queries parse without syntax errors.
- `tests/theme.test.ts`: Validates light and dark theme palettes, contrast, and CSS variables.
- `tests/schemaLayout.test.ts`: Graph layout, distinct handle IDs, orphan tables.
- `tests/diagnostics.test.ts`: Diagnostics for unbounded mutations, Cartesian joins, star projections, leading wildcard searches, syntax errors.
- `tests/dialects.test.ts`: Dialect detection for PostgreSQL, MySQL, and SQLite.
- `tests/queryAnalyzer.test.ts`: AST analysis for CTEs, joins, aggregations, subqueries in FROM, order by, limit.
- `tests/schemaParser.test.ts`: Multi-word data types, composite primary keys, foreign keys, missing indexes.
- `tests/urlState.test.ts`: Codec encoding, hash prefixes, corruption handling.
- `tests/parser.test.ts`: Query parsing, comments handling, empty query handling, and AST models.
- `tests/queryLayout.test.ts`: Query flow DAG layout, CTE connections, dual table support.
