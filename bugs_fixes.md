# Bug Fixes & Code Quality Log

## 1. Handle ID Collisions in React Flow Schema Cards

- **Issue**: Source and target handles on each column row shared the same identifier string (`${table.name}_${col.name}`), causing handle registry collisions and incorrect edge routing in React Flow.
- **Fix**: Suffix target handle IDs with `_target` and source handle IDs with `_source`. Updated `src/layout/schemaLayout.ts` to reference `sourceHandle: ${fk.fromTable}_${fk.fromColumn}_source` and `targetHandle: ${fk.toTable}_${fk.toColumn}_target`.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/layout/schemaLayout.ts`

---

## 2. Schema Parser Multi-Word Data Types

- **Issue**: The column definition regex in `src/parser/schemaParser.ts` truncated multi-word SQL data types (such as `DOUBLE PRECISION`, `INT UNSIGNED`, `CHARACTER VARYING(500)`), causing the second word to be treated as a column constraint.
- **Fix**: Replaced regex matching with keyword boundary scanning that separates the column data type from constraint keywords (`PRIMARY KEY`, `NOT NULL`, `DEFAULT`, `REFERENCES`, `CHECK`).
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaParser.test.ts`

---

## 3. Stale Error State on Database and Sample Selection

- **Issue**: When an invalid query triggered an execution error in `App.tsx`, selecting a new sample query or changing databases cleared `queryResult` but left `executionError` intact, preventing automatic execution of clean sample queries.
- **Fix**: Cleared `setExecutionError(null)` in `handleDbChange` and `handleSelectSample`.
- **Files Modified**:
  - `src/App.tsx`

---

## 4. Theme Mismatch in Graph PNG Export

- **Issue**: `src/graph/export.ts` hardcoded `#0f141c` as the PNG canvas background color, creating dark backgrounds for diagrams exported during light mode.
- **Fix**: Dynamically resolve the computed value of CSS variable `--bg-primary` before generating image export.
- **Files Modified**:
  - `src/graph/export.ts`

---

## 5. Resilient URL Hash State Decoding

- **Issue**: URL hashes modified by browser encoding (e.g. percent-encoding) failed to decompress in `src/share/urlState.ts`.
- **Fix**: Added sanitization and fallback decoding with `decodeURIComponent` before decompression.
- **Files Modified**:
  - `src/share/urlState.ts`
  - `tests/urlState.test.ts`

---

## 6. SQL Formatter Flattening Text to Single Line

- **Issue**: The `handleFormat` function in `EditorPane.tsx` ran a whitespace replacement (`.replace(/\s+/g, ' ')`) after inserting newlines, squashing formatted queries into a single line.
- **Fix**: Implemented structured keyword uppercase conversion and clause boundary newline formatting.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 7. SQLite Foreign Key Null Target Column Resolution

- **Issue**: When a SQLite foreign key referenced a table's primary key without an explicit column name, `PRAGMA foreign_key_list` returned null for the target column, resulting in the literal string `"null"` and broken edge connections.
- **Fix**: Added fallback to default primary key column name (`'id'`) when `fkRow[4]` is null or empty.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 8. Web Worker SQLite Index Extraction & Missing FK Index Warnings

- **Issue**: `GET_SCHEMA` in `src/engine/worker.ts` never queried `PRAGMA index_list` or `PRAGMA index_info`, leaving table indexes empty and missing index diagnostics unpopulated.
- **Fix**: Extracted real indexes via `PRAGMA index_list` and `PRAGMA index_info` per table and computed missing index warnings for foreign key columns.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 9. CTE Flow Edges in Query Graph

- **Issue**: CTE nodes were rendered on the canvas but had no outgoing edges connecting them to the downstream table source nodes referencing that CTE.
- **Fix**: Added directed flow edges from CTE nodes to matching source table nodes in `src/layout/queryLayout.ts`.
- **Files Modified**:
  - `src/layout/queryLayout.ts`
  - `tests/queryLayout.test.ts`

---

## 10. CTE Node Inspector in DetailsPanel

- **Issue**: Clicking on a CTE node in the query flow graph showed an empty inspector state.
- **Fix**: Added dedicated CTE node inspection displaying the CTE name, source tables, projections, and AST details.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 11. Zero-Column Query Feedback in Results Table

- **Issue**: When a query returned zero columns (e.g. DDL / DML commands), `ResultsTable.tsx` displayed the placeholder message "Execute query (Ctrl+Enter) to view results table".
- **Fix**: Added a success state that displays execution time and zero row feedback for non-result queries.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`

---

## UI/UX Enhancements Added

1. **Interactive Table Filter in Schema Explorer**: Added real-time table search input to `SchemaFlowCanvas.tsx` to highlight matching tables and dim non-matching tables.
2. **Download CSV & Page Size Controls**: Added a "Download CSV" file export button alongside "Copy CSV", plus a page size selector (10, 25, 50, 100 rows per page) in `ResultsTable.tsx`.
3. **Active Sort Direction Indicators**: Added clear ascending (`ArrowUp`), descending (`ArrowDown`), and unsorted (`ArrowUpDown`) icons to results table headers.
4. **Keyboard Shortcuts & Help Dialog**: Added a Help modal in `TopNav.tsx` detailing key shortcuts (`Ctrl+Enter` to run, `Ctrl+Space` for autocomplete, node click inspection).
5. **Dedicated Sort & Limit Inspector**: Added full inspection for `ORDER BY` directions and `LIMIT / OFFSET` numbers in `DetailsPanel.tsx`.
6. **Interactive SQL Formatter**: Added a format toolbar button in `EditorPane.tsx` to standardize SQL casing and clause breaks.

---

## Expanded Test Coverage (8 Test Suites, 34 Tests)

- `tests/schemaLayout.test.ts`: Graph layout, distinct handle IDs, orphan tables.
- `tests/diagnostics.test.ts`: Diagnostics for unbounded mutations, Cartesian joins, star projections, leading wildcard searches, syntax errors.
- `tests/dialects.test.ts`: Dialect detection for PostgreSQL, MySQL, and SQLite.
- `tests/queryAnalyzer.test.ts`: AST analysis for CTEs, joins, aggregations, order by, limit.
- `tests/schemaParser.test.ts`: Multi-word data types, composite primary keys, foreign keys, missing indexes.
- `tests/urlState.test.ts`: Codec encoding, hash prefixes, corruption handling.
- `tests/parser.test.ts`: Query parsing and AST models.
- `tests/queryLayout.test.ts`: Query flow DAG layout, CTE connections, dual table support.
