# Bug Fixes & Code Quality Log

## 1. DetailsPanel Projection Expression Fallback

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.tsx`, projections and CTE output items without a `raw` string rendered blank text instead of resolving expressions and aliases.
- **Fix**: Added fallback to `p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*'`.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 2. DetailsPanel Filter & Aggregate String Fallbacks

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.tsx`, `String(data.raw)` evaluated to the literal string `"undefined"` when `raw` was omitted on filter or aggregate nodes.
- **Fix**: Added fallback to join column lists or display condition labels.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 3. Escape Key Support on Schema Table Filter

- **Issue**: In `src/graph/SchemaFlowCanvas.tsx`, pressing `Escape` while focused in the table filter input did not clear the search query.
- **Fix**: Added `onKeyDown` handler that resets `searchQuery` to an empty string on `Escape`.
- **Files Modified**:
  - `src/graph/SchemaFlowCanvas.tsx`

---

## 4. Foreign Key Edge Label Pointer Event Interference

- **Issue**: In `src/graph/edges/ForeignKeyEdge.tsx`, edge labels used `pointerEvents: 'all'`, intercepting clicks and drag events from users trying to pan the canvas over relationship labels.
- **Fix**: Updated the style to `pointerEvents: 'none'` and added `userSelect: 'none'`.
- **Files Modified**:
  - `src/graph/edges/ForeignKeyEdge.tsx`

---

## 5. TableNode Empty Subtext Container

- **Issue**: In `src/graph/nodes/TableNode.tsx`, table cards without aliases or schemas rendered an empty body block.
- **Fix**: Added a fallback subtext description: "Source table".
- **Files Modified**:
  - `src/graph/nodes/TableNode.tsx`

---

## 6. CTESubgraphNode Summary Fallback

- **Issue**: In `src/graph/nodes/CTESubgraphNode.tsx`, CTE nodes without explicit summaries rendered blank code blocks.
- **Fix**: Added a fallback summary expression that resolves underlying source table names.
- **Files Modified**:
  - `src/graph/nodes/CTESubgraphNode.tsx`

---

## 7. Modal Accessibility Attributes in TopNav

- **Issue**: In `src/ui/TopNav/TopNav.tsx`, the Help dialog lacked proper accessibility roles and labels for assistive devices.
- **Fix**: Added `role="dialog"`, `aria-modal="true"`, and `aria-label="Keyboard Shortcuts and Help Guide"`.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`

---

## 8. Editor Toolbar Accessibility Labels

- **Issue**: In `src/ui/EditorPane/EditorPane.tsx`, icon buttons lacked `aria-label` descriptors.
- **Fix**: Added explicit `aria-label` attributes across Format, Clear, Open, and Run buttons.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 9. Logo Path Normalization for Subpath & Root Deployments

- **Issue**: In `src/ui/TopNav/TopNav.tsx`, `${import.meta.env.BASE_URL || './'}sqlens-logo.svg` produced double slashes or missing slashes depending on whether `BASE_URL` included a trailing slash.
- **Fix**: Normalized `baseUrl` to ensure a single trailing slash.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`

---

## 10. Results Table Download CSV Icon Mismatch

- **Issue**: In `src/ui/ResultsTable/ResultsTable.tsx`, the Download CSV button rendered a copy clipboard icon (`<Copy />`) instead of a download icon (`<Download />`).
- **Fix**: Imported and rendered `<Download size={12} />` on the download action button.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`

---

## 11. Results Table Zero-Row Pagination Formatting

- **Issue**: In `src/ui/ResultsTable/ResultsTable.tsx`, queries returning column headers but 0 rows showed "Page 1 of 0".
- **Fix**: Clamped total page count with `Math.max(1, table.getPageCount())`.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/export.test.ts`

---

## 12. Conditional Clickable Cursor in Diagnostics Bar

- **Issue**: In `src/ui/DiagnosticsBar/DiagnosticsBar.tsx`, diagnostic items without line numbers showed a pointer cursor even though clicking had no target.
- **Fix**: Applied `pointer` cursor and click handler only when `d.line` is a valid positive number.
- **Files Modified**:
  - `src/ui/DiagnosticsBar/DiagnosticsBar.tsx`

---

## 13. Close Button Accessibility in Details Panel

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.tsx`, close buttons lacked `aria-label` and `title` attributes.
- **Fix**: Added `aria-label="Close inspector panel"` and `title="Close inspector panel"`.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 14. Schema-Qualified Table Name Support in DDL Parser

- **Issue**: In `src/parser/schemaParser.ts`, regex patterns for `CREATE TABLE`, `ALTER TABLE`, and `CREATE INDEX` only matched unqualified identifiers, causing schema-qualified names (e.g. `CREATE TABLE public.users (...)` or `CREATE TABLE "app"."orders" (...)`) to fail parsing.
- **Fix**: Updated table name regexes with optional schema prefix capture `(?:["`']?([a-zA-Z0-9_]+)["`']?\.)?["`']?([a-zA-Z0-9_]+)["`']?`.
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaParser.test.ts`

---

## 15. OutputNode Expression and Alias Fallback

- **Issue**: In `src/graph/nodes/OutputNode.tsx`, projections without a `raw` property rendered blank lines instead of the column expression or alias.
- **Fix**: Added fallback to `p.raw || (p.alias ? `${p.expr} AS ${p.alias}` : p.expr) || '*'`.
- **Files Modified**:
  - `src/graph/nodes/OutputNode.tsx`

---

## 16. AggregateNode Grouping Keys Fallback

- **Issue**: In `src/graph/nodes/AggregateNode.tsx`, empty or omitted `raw` properties displayed blank snippet blocks.
- **Fix**: Added fallback to `aggData.raw || aggData.columns?.join(', ') || 'ALL'`.
- **Files Modified**:
  - `src/graph/nodes/AggregateNode.tsx`

---

## 17. FilterNode Code Snippet Fallback

- **Issue**: In `src/graph/nodes/FilterNode.tsx`, missing `raw` filter text left the snippet area empty.
- **Fix**: Added fallback to `filterData.raw || (filterData.columns?.length ? filterData.columns.join(' AND ') : 'Condition')`.
- **Files Modified**:
  - `src/graph/nodes/FilterNode.tsx`

---

## 18. SortLimitNode Empty State Feedback

- **Issue**: In `src/graph/nodes/SortLimitNode.tsx`, if both `orderBy` and `limit` were empty, the card body was blank.
- **Fix**: Added a fallback message: "Natural order, no limit".
- **Files Modified**:
  - `src/graph/nodes/SortLimitNode.tsx`

---

## 19. Circular AST JSON Stringifier Protection

- **Issue**: In `src/parser/queryAnalyzer.ts`, `exprToString()` called `JSON.stringify(expr)` directly on unrecognized nodes, throwing `TypeError: Converting circular structure to JSON` if AST structures contained circular parent references.
- **Fix**: Wrapped `JSON.stringify(expr)` with a `try/catch` block that falls back to `String(expr)`.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`
  - `tests/parser.test.ts`

---

## 20. MySQL Comma-Separated LIMIT/OFFSET Extraction

- **Issue**: In `src/parser/queryAnalyzer.ts`, MySQL queries using `LIMIT offset, count` syntax (e.g. `LIMIT 10, 20`) swapped the limit count and offset values because the parser stored offset in the first position.
- **Fix**: Checked `separator === ','` to assign the first value to `offset` and the second value to `count`.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`
  - `tests/queryAnalyzer.test.ts`

---

## 21. Empty usingColumns Array Guard in Query Analyzer

- **Issue**: In `src/parser/queryAnalyzer.ts`, `usingCols` evaluated to `[]` when `item.using` had zero elements, incorrectly satisfying truthy checks and suppressing Cartesian join warnings.
- **Fix**: Guarded with `Array.isArray(item.using) && item.using.length > 0`.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`

---

## 22. Semantic Color-Coded Minimap Navigation

- **Issue**: React Flow minimaps in `QueryFlowCanvas.tsx` and `SchemaFlowCanvas.tsx` rendered monochrome rectangles for all nodes, making visual orientation difficult.
- **Fix**: Added dynamic `nodeColor` handlers in `QueryFlowCanvas.tsx` and `SchemaFlowCanvas.tsx` that map node types to distinct colors (Blue: Tables, Purple: Joins, Amber: Filters / Orphans, Cyan: Aggregations, Magenta: Sorting, Green: Output, Violet: CTEs).
- **Files Modified**:
  - `src/graph/QueryFlowCanvas.tsx`
  - `src/graph/SchemaFlowCanvas.tsx`

---

## 23. SVG AnimatedString Class Filter in PNG Export

- **Issue**: In `src/graph/export.ts`, `node.className` for SVG nodes was an `SVGAnimatedString` object instead of a string, which prevented the filter from properly evaluating class names and excluding the minimap.
- **Fix**: Extracted `.baseVal` when `className` is an SVG object and excluded both `react-flow__controls` and `react-flow__minimap`.
- **Files Modified**:
  - `src/graph/export.ts`

---

## 24. JSON Object Output Formatting in Results Table

- **Issue**: In `src/ui/ResultsTable/ResultsTable.tsx`, queries returning JSON objects or arrays displayed the literal string `"[object Object]"` in table cells.
- **Fix**: Formatted object and array values using `JSON.stringify(val)`.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/export.test.ts`

---

## 25. Editor jumpToLine Column Offset Normalization

- **Issue**: In `src/ui/EditorPane/EditorPane.tsx`, `jumpToLine` subtracted 1 directly from `column`, causing negative target positions if `column === 0`.
- **Fix**: Clamped `safeColumn = Math.max(1, column)`.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 26. Table Indexes Breakdown in Details Panel

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.tsx`, table details only displayed columns and relationships, omitting defined table indexes.
- **Fix**: Rendered real table indexes, unique flags, and indexed column lists in the inspector drawer.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 27. Schema Mode Dynamic Masonry Table Placement

- **Issue**: In `src/layout/schemaLayout.ts`, table cards were laid out on a fixed 340px grid, causing tables with more than 10 columns to vertically overlap downstream cards.
- **Fix**: Replaced the fixed grid with dynamic column Y-offset tracking that calculates heights based on individual column counts.
- **Files Modified**:
  - `src/layout/schemaLayout.ts`

---

## 28. SQLite group_concat Dialect Misclassification

- **Issue**: In `src/parser/dialects.ts`, `group_concat(` was listed as an exclusive MySQL construct, causing standard SQLite queries with `group_concat` to be falsely detected as MySQL.
- **Fix**: Removed `group_concat(` from MySQL-exclusive patterns.
- **Files Modified**:
  - `src/parser/dialects.ts`
  - `tests/dialects.test.ts`

---

## 29. URL Hash State Type & Shape Guarding

- **Issue**: In `src/share/urlState.ts`, decompression of malformed hashes could return primitives, arrays, or objects missing required query parameters.
- **Fix**: Validated that the decoded JSON payload contains valid string properties before returning `AppUrlState`.
- **Files Modified**:
  - `src/share/urlState.ts`

---

## 30. Unique Key (UQ) Visual Badges on Table Cards

- **Issue**: Columns marked as unique in table schemas had no visual identifier in `TableCardNode.tsx`.
- **Fix**: Added cyan `UQ` badges for unique non-primary columns on table cards.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`

---

## 31. JOIN USING Column Reference Extraction Bug

- **Issue**: In `src/parser/queryAnalyzer.ts`, `item.using.map(String)` converted column reference AST objects into `'[object Object]'` instead of extracting the column name.
- **Fix**: Updated extraction to resolve `column`, `value`, or `exprToString()` from AST objects.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`
  - `tests/parser.test.ts`

---

## 32. JoinNode Empty usingColumns False-Positive Guard

- **Issue**: In `src/graph/nodes/JoinNode.tsx`, `{joinData.usingColumns && ...}` evaluated to true on empty arrays (`[]`), rendering `USING ()` and masking Cartesian product warnings.
- **Fix**: Guarded with `joinData.usingColumns && joinData.usingColumns.length > 0`.
- **Files Modified**:
  - `src/graph/nodes/JoinNode.tsx`

---

## 33. ErrorBoundary Session Reset Recovery Option

- **Issue**: When an uncaught exception occurred (such as corrupted localStorage or malformed URL hashes), `ErrorBoundary.tsx` only provided a simple reload button, which could cause an infinite reload loop.
- **Fix**: Added a secondary "Reset Session" button that clears URL hashes, resets theme storage, and restores default application state.
- **Files Modified**:
  - `src/ErrorBoundary.tsx`

---

## 34. CTESubgraphNode Target Handle for Chained Sub-Pipelines

- **Issue**: `CTESubgraphNode.tsx` only provided a source handle, preventing visual chaining between upstream and downstream CTE blocks.
- **Fix**: Added target `<Handle>` to `CTESubgraphNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/CTESubgraphNode.tsx`

---

## 35. Help Dialog Keyboard Dismissal on Escape

- **Issue**: The Help & Keyboard Shortcuts modal in `TopNav.tsx` had no keyboard listener, requiring users to manually click the backdrop or close button to dismiss it.
- **Fix**: Added a dedicated `useEffect` listener to dismiss the modal when pressing the `Escape` key.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`

---

## 36. Window Resize Diagram Auto-Fit

- **Issue**: When resizing the browser window, toggling fullscreen, or docking browser developer tools, `QueryFlowCanvas.tsx` and `SchemaFlowCanvas.tsx` did not adjust their viewports, causing graphs to be off-center or clipped.
- **Fix**: Added a window `resize` event listener with debounced `fitView` centering.
- **Files Modified**:
  - `src/graph/QueryFlowCanvas.tsx`
  - `src/graph/SchemaFlowCanvas.tsx`

---

## 37. Query Diagnostics for Random Sorting & Redundant Distinct

- **Issue**: `ORDER BY RANDOM()` and `SELECT DISTINCT` combined with `GROUP BY` were not flagged in the query analyzer, missing critical performance diagnostic warnings.
- **Fix**: Added performance rules for random sorting (`ORDER BY RAND() / RANDOM()`) and redundant `SELECT DISTINCT ... GROUP BY`.
- **Files Modified**:
  - `src/parser/parser.ts`
  - `tests/diagnostics.test.ts`

---

## 38. TableNode Target Handle for CTE Ingress Connections

- **Issue**: `TableNode.tsx` only defined a right source handle, preventing incoming edges from Common Table Expressions (CTEs) or subqueries from docking on the left of table nodes.
- **Fix**: Added target `<Handle>` component on the left side of `TableNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/TableNode.tsx`

---

## 39. Diagnostics Bar Line 0 Rendering Bug

- **Issue**: In `DiagnosticsBar.tsx`, `{d.line && <span className={styles.badge}>Line {d.line}</span>}` rendered the raw number `0` in the DOM when `d.line === 0`.
- **Fix**: Added a strict guard `{typeof d.line === 'number' && d.line > 0 && ...}`.
- **Files Modified**:
  - `src/ui/DiagnosticsBar/DiagnosticsBar.tsx`

---

## 40. Results Table CSV Export Type Serialization

- **Issue**: Boolean, null, and object values in query results were serialized as unquoted or poorly formatted string representations in `generateCsv()`.
- **Fix**: Added type-aware CSV serialization handling numbers, `TRUE`/`FALSE` booleans, escaped JSON objects, and empty null cells.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/export.test.ts`

---

## 41. Concurrent SqlEngineClient Initialization Race Condition

- **Issue**: `SqlEngineClient.init()` lacked initialization promise caching, causing concurrent callers during startup or database switching to instantiate multiple Web Workers and overwrite pending request maps.
- **Fix**: Cached `initPromise` until initialization resolves, ensuring all concurrent callers await the same Web Worker instance.
- **Files Modified**:
  - `src/engine/client.ts`

---

## 42. Stale Callback Closure in CodeMirror Keymaps

- **Issue**: `Mod-Enter` (`onRunQuery`) and `updateListener` (`onChange`) in `EditorPane.tsx` captured initial closures from `useEffect(..., [])`, invoking stale props when parent state updated.
- **Fix**: Wrapped callbacks in mutable refs (`onRunQueryRef` and `onChangeRef`).
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 43. URL Hash State Hydration Flash

- **Issue**: `selectedDbId`, `sqlQuery`, and `mode` initialized with hardcoded defaults before reading the URL hash, causing a brief flash and state replacement.
- **Fix**: Lazily initialized state from `decodeStateFromHash(window.location.hash)`.
- **Files Modified**:
  - `src/App.tsx`

---

## 44. Cursor Position Reset on SQL Formatter

- **Issue**: Running the format action in `EditorPane.tsx` dispatched document changes without preserving selection, resetting the cursor to index 0.
- **Fix**: Preserved the main selection head offset during dispatch and clamped to the formatted document length.
- **Files Modified**:
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 45. Handle ID Collisions in React Flow Schema Cards

- **Issue**: Source and target handles on each column row shared the same identifier string (`${table.name}_${col.name}`), causing handle registry collisions and incorrect edge routing in React Flow.
- **Fix**: Suffix target handle IDs with `_target` and source handle IDs with `_source`. Updated `src/layout/schemaLayout.ts` to reference `sourceHandle: ${fk.fromTable}_${fk.fromColumn}_source` and `targetHandle: ${fk.toTable}_${fk.toColumn}_target`.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/layout/schemaLayout.ts`

---

## 46. Schema Parser Multi-Word Data Types

- **Issue**: The column definition regex in `src/parser/schemaParser.ts` truncated multi-word SQL data types (such as `DOUBLE PRECISION`, `INT UNSIGNED`, `CHARACTER VARYING(500)`), causing the second word to be treated as a column constraint.
- **Fix**: Replaced regex matching with keyword boundary scanning that separates the column data type from constraint keywords (`PRIMARY KEY`, `NOT NULL`, `DEFAULT`, `REFERENCES`, `CHECK`).
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaParser.test.ts`

---

## 47. Stale Error State on Database and Sample Selection

- **Issue**: When an invalid query triggered an execution error in `App.tsx`, selecting a new sample query or changing databases cleared `queryResult` but left `executionError` intact, preventing automatic execution of clean sample queries.
- **Fix**: Cleared `setExecutionError(null)` in `handleDbChange` and `handleSelectSample`.
- **Files Modified**:
  - `src/App.tsx`

---

## 48. Theme Mismatch in Graph PNG Export

- **Issue**: `src/graph/export.ts` hardcoded `#0f141c` as the PNG canvas background color, creating dark backgrounds for diagrams exported during light mode.
- **Fix**: Dynamically resolve the computed value of CSS variable `--bg-primary` before generating image export.
- **Files Modified**:
  - `src/graph/export.ts`

---

## 49. Resilient URL Hash State Decoding

- **Issue**: URL hashes modified by browser encoding (e.g. percent-encoding) failed to decompress in `src/share/urlState.ts`.
- **Fix**: Added sanitization and fallback decoding with `decodeURIComponent` before decompression.
- **Files Modified**:
  - `src/share/urlState.ts`
  - `tests/urlState.test.ts`

---

## 50. SQLite Foreign Key Null Target Column Resolution

- **Issue**: When a SQLite foreign key referenced a table's primary key without an explicit column name, `PRAGMA foreign_key_list` returned null for the target column, resulting in the literal string `"null"` and broken edge connections.
- **Fix**: Added fallback to default primary key column name (`'id'`) when `fkRow[4]` is null or empty.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 51. Web Worker SQLite Index Extraction & Missing FK Index Warnings

- **Issue**: `GET_SCHEMA` in `src/engine/worker.ts` never queried `PRAGMA index_list` or `PRAGMA index_info`, leaving table indexes empty and missing index diagnostics unpopulated.
- **Fix**: Extracted real indexes via `PRAGMA index_list` and `PRAGMA index_info` per table and computed missing index warnings for foreign key columns.
- **Files Modified**:
  - `src/engine/worker.ts`

---

## 52. CTE Flow Edges in Query Graph

- **Issue**: CTE nodes were rendered on the canvas but had no outgoing edges connecting them to the downstream table source nodes referencing that CTE.
- **Fix**: Added directed flow edges from CTE nodes to matching source table nodes in `src/layout/queryLayout.ts`.
- **Files Modified**:
  - `src/layout/queryLayout.ts`
  - `tests/queryLayout.test.ts`

---

## 53. CTE Node Inspector in DetailsPanel

- **Issue**: Clicking on a CTE node in the query flow graph showed an empty inspector state.
- **Fix**: Added dedicated CTE node inspection displaying the CTE name, source tables, projections, and AST details.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`

---

## 54. Zero-Column Query Feedback in Results Table

- **Issue**: When a query returned zero columns (e.g. DDL / DML commands), `ResultsTable.tsx` displayed the placeholder message "Execute query (Ctrl+Enter) to view results table".
- **Fix**: Added a success state that displays execution time and zero row feedback for non-result queries.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`

---

## 55. Extendable Editor with Draggable Horizontal & Vertical Resizers

- **Issue**: The query editor pane had a fixed width (480px) and fixed results pane height (260px) that could not be extended, resized, or expanded.
- **Fix**: Added interactive draggable horizontal and vertical resize handles with persistent width/height in `localStorage`, plus an Extend/Collapse toolbar button in `EditorPane.tsx`.
- **Files Modified**:
  - `src/App.tsx`
  - `src/App.module.css`
  - `src/ui/EditorPane/EditorPane.tsx`

---

## 56. GitHub Repository Logo and Link in Top Navigation

- **Issue**: The top navigation header lacked a link to the project source code on GitHub.
- **Fix**: Added a GitHub action button with an SVG icon linking directly to `https://github.com/amanalip/SQLens`.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`

---

## 57. URL State Database ID Whitespace Normalization & Percent-Encoding

- **Issue**: In `src/share/urlState.ts`, decoded database IDs containing whitespace were not normalized, causing failed lookups instead of falling back to default databases.
- **Fix**: Added whitespace trimming and validation in `decodeStateFromHash` and added unit test coverage.
- **Files Modified**:
  - `src/share/urlState.ts`
  - `tests/urlState.test.ts`

---

## UI/UX Enhancements Added

1. **Extendable & Resizable Editor Layout**: Drag the vertical splitter to adjust results height or the horizontal splitter to adjust editor pane width.
2. **Extend/Collapse Editor Toolbar Button**: Quick-toggle button in `EditorPane` to expand editor width to 800px or collapse to 480px.
3. **GitHub Repository Navigation Link**: Quick-access GitHub link with icon in the Top Navigation bar.
4. **Quick-Clear Table Search via Escape**: Pressing `Escape` while focused in the Schema Mode filter input clears the search query instantly.
5. **Accessible Schema Filter Input**: Search input and clear button include standard ARIA labels and tooltips.
6. **Zero-Stringify Fallbacks in Inspector**: Inspector panel never displays raw `"undefined"` text for missing node metadata.
7. **Enhanced Projection Breakdown in Inspector**: Projections and CTE outputs dynamically resolve aliases and expressions.
8. **Non-Blocking Foreign Key Labels**: Relationship labels in schema graphs allow click-through and smooth panning.
9. **Descriptive Table Card Subtitles**: Query flow cards display clean badges for standalone source tables.
10. **Complete Modal Accessibility**: Help and keyboard shortcuts dialog conforms to dialog ARIA standards.
11. **Comprehensive Toolbar Hints**: Query editor buttons include descriptive tooltips and ARIA descriptors.
12. **Instant CTE Data Flow Inspection**: CTE nodes display synthesized data flow summaries based on active sources.
13. **Clean Output Formatting Across Panes**: Results tables, inspector drawers, and canvas nodes render synchronized SQL expressions.
14. **Action-Appropriate Download Icon in Results Table**: Download CSV button features a dedicated file download glyph instead of a clipboard copy glyph.
## 58. TableCardNode Live Row Count and Metadata Badges

- **Issue**: Table cards in Schema Mode did not indicate total rows or default values, requiring users to query tables manually to see table scale.
- **Fix**: Added live row count badge (`275 rows`), index count badge (`2 idx`), default value badges (`DEF`), and foreign key target references in `TableCardNode.tsx`.
- **Files Modified**:
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/engine/worker.ts`

---

## 59. Schema Inspector Live Sample Data Preview & DDL Syntax

- **Issue**: Inspecting a table in Schema Mode showed only column names and types without sample data or the underlying table DDL script.
- **Fix**: Added a 5-row live Sample Data Preview table and a formatted `CREATE TABLE` DDL block in `DetailsPanel.tsx`.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`
  - `src/ui/DetailsPanel/DetailsPanel.module.css`
  - `src/engine/worker.ts`

---

## 60. Custom SQLite Database Upload Support

- **Issue**: Users could only view pre-bundled sample databases and could not load or explore their own SQLite database files.
- **Fix**: Added an "Upload DB" button with file picker support for `.sqlite` and `.db` files, loading custom database buffers into the WebAssembly engine and extracting the schema dynamically.
- **Files Modified**:
  - `src/ui/TopNav/TopNav.tsx`
  - `src/App.tsx`
  - `src/engine/client.ts`

---

## 61. Real-Time Schema Refresh on DDL and DML Mutations

- **Issue**: Running `CREATE TABLE`, `DROP TABLE`, or `ALTER TABLE` in the editor modified SQLite memory but did not immediately refresh the visual Schema canvas.
- **Fix**: Added automatic schema reload in `handleRunQuery` whenever DDL or DML statements execute.
- **Files Modified**:
  - `src/App.tsx`

---

## 62. Query Analyzer AST Extraction for Mutations (INSERT, UPDATE, DELETE)

- **Issue**: In `src/parser/queryAnalyzer.ts`, `INSERT`, `UPDATE`, and `DELETE` queries storing target table references in `ast.table` were not extracted into `model.sources`.
- **Fix**: Added fallback from `node.from` to `node.table` to populate table sources for all mutation AST models.
- **Files Modified**:
  - `src/parser/queryAnalyzer.ts`

---

## 63. 230 Verified Queries Across All 23 Sample Databases

- **Issue**: Previous sample query collection had only 3 to 4 queries per database (72 queries total) without coverage of data modifications or window functions.
- **Fix**: Expanded all 23 databases to 10 verified queries each (230 total queries) covering filtering, joins, aggregations, subqueries, CTEs, window functions, and data modifications (`INSERT`, `UPDATE`, `DELETE`).
- **Files Modified**:
  - `src/samples/chinook.ts`
  - `src/samples/northwind.ts`
  - `src/samples/sakila.ts`
  - `src/samples/world.ts`
  - `src/samples/employees.ts`
  - `src/samples/formula1.ts`
  - `src/samples/classicmodels.ts`
  - `src/samples/imdb.ts`
  - `src/samples/spotify.ts`
  - `src/samples/pokemon.ts`
  - `src/samples/university.ts`
  - `src/samples/premierLeague.ts`
  - `src/samples/ecommerce.ts`
  - `src/samples/github.ts`
  - `src/samples/flights.ts`
  - `src/samples/hospital.ts`
  - `src/samples/realEstate.ts`
  - `src/samples/stocks.ts`
  - `src/samples/foodDelivery.ts`
  - `src/samples/library.ts`
  - `src/samples/gaming.ts`
  - `src/samples/crypto.ts`
  - `src/samples/hotels.ts`
  - `src/samples/types.ts`
  - `src/samples/index.ts`

---

## 70. Schema Layout Safe Fallbacks on Missing Collections

- **Issue**: In `src/layout/schemaLayout.ts`, calling `schema.orphanTables.includes(...)` caused a `TypeError: Cannot read properties of undefined` if `orphanTables` or `foreignKeys` was omitted on dynamic schema models.
- **Fix**: Added safe array validation fallbacks for `orphanTables` and `foreignKeys`.
- **Files Modified**:
  - `src/layout/schemaLayout.ts`
  - `tests/emptySchemaHandling.test.ts`

---

## 71. Dialect Detection False Positive Protection for String Literals

- **Issue**: In `src/parser/dialects.ts`, searching for `::` or `ilike` matched text inside string literals (e.g. `'http://api.service.com::8080/v1'` or `'I like learning SQL'`), misclassifying queries as PostgreSQL.
- **Fix**: Stripped single- and double-quoted string literals prior to checking dialect syntax signatures.
- **Files Modified**:
  - `src/parser/dialects.ts`
  - `tests/dialectsLiteralProtection.test.ts`

---

## 72. Schema Search by Column Name & Table Name

- **Issue**: In `src/graph/SchemaFlowCanvas.tsx`, table search only matched table names, making it impossible to locate tables by column names (e.g. `billing_country`, `postal_code`).
- **Fix**: Extended search matching to inspect both table names and column lists.
- **Files Modified**:
  - `src/graph/SchemaFlowCanvas.tsx`
  - `tests/schemaColumnSearch.test.ts`

---

## 73. Graph Image Export Overlay Filter

- **Issue**: In `src/graph/export.ts`, search inputs and top overlay panels appeared in downloaded PNG screenshots.
- **Fix**: Expanded screenshot node filter to ignore elements with `data-export-ignore="true"` and `.react-flow__panel` classes.
- **Files Modified**:
  - `src/graph/export.ts`
  - `src/graph/SchemaFlowCanvas.tsx`
  - `tests/exportFilter.test.ts`

---

## 75. Error Boundary Layout Dimension Storage Cleanup

- **Issue**: In `src/ErrorBoundary.tsx`, resetting the session only removed `sqlens_theme`, leaving broken or corrupted panel width/height settings in `localStorage`.
- **Fix**: Added cleanup for `sqlens_editor_width` and `sqlens_results_height` to guarantee full recovery.
- **Files Modified**:
  - `src/ErrorBoundary.tsx`
  - `tests/errorBoundaryReset.test.ts`

---

## 77. Comment-Only SQL Query Parsing Guard

- **Issue**: In `src/parser/parser.ts`, submitting an SQL query with only line or block comments caused `node-sql-parser` to fail with a syntax error diagnostic instead of returning an empty query model.
- **Fix**: Stripped line comments and block comments before empty query checks and returned an empty `QueryModel` with zero error diagnostics.
- **Files Modified**:
  - `src/parser/parser.ts`
  - `tests/commentOnlyQuery.test.ts`

---

## 78. Automatic In-Table Search Filter Synchronization

- **Issue**: In `src/ui/ResultsTable/ResultsTable.tsx`, searching rows retained stale search queries when subsequent queries with different column names were executed, unintentionally hiding new query results.
- **Fix**: Synchronized state to clear `filterQuery` whenever query execution results change.
- **Files Modified**:
  - `src/ui/ResultsTable/ResultsTable.tsx`
  - `tests/resultsTableReset.test.ts`

---

## 80. Schema DDL Column Default Value Extraction

- **Issue**: In `src/parser/schemaParser.ts`, column `DEFAULT` values (numeric, string, timestamp) were parsed as part of the constraint string but never assigned to `col.defaultValue`, leaving default indicators missing.
- **Fix**: Added regex extraction for `DEFAULT <expr>` in `parseTableDefinition` and assigned it to `ColumnSchema.defaultValue`.
- **Files Modified**:
  - `src/parser/schemaParser.ts`
  - `tests/schemaDefaultValue.test.ts`

---

## 81. CTE Node Type Matching in Details Panel Inspector

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.tsx`, CTE nodes rendered under type `cteSubgraphNode` fell through to generic details instead of rendering the dedicated Common Table Expression (WITH) inspector.
- **Fix**: Updated condition to match both `cteNode` and `cteSubgraphNode`.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.tsx`
  - `tests/cteInspectorDetails.test.ts`

---

## 83. Output Node Safe Projection Fallbacks

- **Issue**: In `src/graph/nodes/OutputNode.tsx`, accessing `outputData.projections.length` on non-SELECT or raw DDL queries caused a `TypeError` if `projections` was undefined.
- **Fix**: Added safe array validation `(outputData.projections && outputData.projections.length > 0)` and defaulted to wildcard representation.
- **Files Modified**:
  - `src/graph/nodes/OutputNode.tsx`
  - `tests/outputNodeSafeRender.test.ts`

---

## 84. Sort & Limit Node Safe OrderBy Fallback

- **Issue**: In `src/graph/nodes/SortLimitNode.tsx`, accessing `sortData.orderBy.length` directly threw an error when `orderBy` was omitted in dynamic query models.
- **Fix**: Added safe fallback checking `(!sortData.orderBy || sortData.orderBy.length === 0)` and displayed a clean "Natural order, no limit" message.
- **Files Modified**:
  - `src/graph/nodes/SortLimitNode.tsx`
  - `tests/sortLimitSafeRender.test.ts`

---

## 86. Relationship Edge and Tooltip Arrow Typography

- **Issue**: Foreign key edge labels in `src/layout/schemaLayout.ts`, CTE flow summaries in `src/layout/queryLayout.ts`, and table card tooltip references in `src/graph/nodes/TableCardNode.tsx` used raw ASCII `->` text rather than properly shaped unicode arrows.
- **Fix**: Replaced all instances of `->` with `→` in `schemaLayout.ts`, `queryLayout.ts`, `TableCardNode.tsx`, and `ForeignKeyEdge.tsx`.
- **Files Modified**:
  - `src/layout/schemaLayout.ts`
  - `src/layout/queryLayout.ts`
  - `src/graph/nodes/TableCardNode.tsx`
  - `src/graph/edges/ForeignKeyEdge.tsx`
  - `tests/footerAndArrow.test.ts`

---

## 87. Proportional Relationship Edge Arrow Sizing & Direct Author Link

- **Issue**: Relationship edge badge arrow glyph was rendered at equal small font size to monospace text without vertical centering, and the footer author name was not directly hyperlinked to GitHub.
- **Fix**: Structured `ForeignKeyEdge.tsx` to render a dedicated, proportional 14px centered arrow glyph between column tokens, and hyperlinked the author's name in `App.tsx` directly to their GitHub profile (`https://github.com/amanalip`).
- **Files Modified**:
  - `src/graph/edges/ForeignKeyEdge.tsx`
  - `src/App.tsx`
  - `src/App.module.css`
  - `tests/footerAndArrow.test.ts`

---

## 88. Horizontally & Vertically Scrollable Sample Data Preview

- **Issue**: In `src/ui/DetailsPanel/DetailsPanel.module.css`, sample data preview tables with many columns squished table width to 100%, causing rightmost columns to truncate with ellipses.
- **Fix**: Updated `.previewTable` to `width: max-content; min-width: 100%`, added sticky headers, and added thin scrollbars with full horizontal and vertical overflow support.
- **Files Modified**:
  - `src/ui/DetailsPanel/DetailsPanel.module.css`
  - `tests/sampleDataPreview.test.ts`

---

## UI/UX Feature Enhancements Log

1. **Scrollable Sample Data Previews**: Multi-column live sample data tables scroll horizontally and vertically with sticky column headers.
2. **Application Footer with Author Attribution**: Added footer with `© 2026 - Aman Ali Pogaku` and GitHub account link (`https://github.com/amanalip`).
3. **Proper Unicode Arrow Typography**: Polished relationship arrows (`→`) across edges, CTE badges, and table cards.
4. **Extendable Editor Resizers**: Horizontal and vertical splitters allowing dynamic panel resizing with `localStorage` persistence.
5. **Extend / Collapse Quick Toggle**: Toolbar button to switch between 480px and 800px editor width.
6. **GitHub Project Navigation Link**: SVG brand icon linking to repository source.
7. **Dark Mode Canvas Control Styling**: Styled `@xyflow/react` controls and minimap for high contrast in dark mode.
8. **Live Table Row Counts**: Header pills showing row counts on every schema table card.
9. **Sample Data Preview in Table Drawer**: 5-row live data preview table for inspected tables.
10. **Table DDL Syntax Block**: Formatted `CREATE TABLE` syntax view in inspector drawer.
11. **Column Default Value & Foreign Key Badges**: Inline badges displaying defaults and target references.
12. **Custom SQLite DB File Upload**: Upload custom `.sqlite` and `.db` files from the top navigation bar.
13. **230 Verified Example Queries**: 10 curated queries for each of the 23 sample databases.
14. **Protected String Literal SQL Formatter**: Preserves casing and layout inside single- and double-quoted strings.
15. **In-Table Real-Time Search / Row Filter**: Filter result table rows in memory with matching row counts.
16. **Animated Execution Spinner & Progress State**: Clear WebAssembly loading feedback in results pane.
17. **Clear Results Action Button**: Dismiss query results or error states with one click.
18. **Visual Subquery Block Cards**: Connected subquery node visualization for nested `WHERE` queries.
19. **Custom Database Graceful Example Handling**: Clear status indicator for uploaded custom databases.
20. **Inline Diagnostic Suggestion Badges**: Direct tip badges on diagnostics bar for faster query fixes.
21. **One-Click Copy SQL to Clipboard**: Copy button in editor toolbar with transient confirmation.
22. **Column-Name Schema Table Filtering**: Locate schema tables by typing any column name in the search bar.
23. **Clean Graph PNG Exporting**: Automatic exclusion of search overlays and UI widgets from diagram screenshots.

---

## Expanded Test Coverage (40 Test Suites, 129 Tests)

- `tests/sampleDataPreview.test.ts`: Validates complete preservation of all table columns across sample preview rows.
- `tests/footerAndArrow.test.ts`: Formatted relationship arrow glyphs and footer attribution links.
- `tests/outputNodeSafeRender.test.ts`: Output projection rendering with explicit aliases, empty arrays, and undefined models.
- `tests/sortLimitSafeRender.test.ts`: Sort direction formatting, column lists, and limit/offset rendering.
- `tests/aggregateNodeSafeRender.test.ts`: Raw aggregate expressions and column fallback formatting.
- `tests/joinNodeDisplay.test.ts`: Join conditions, USING clauses, and Cartesian product identification.
- `tests/tableNodeDisplay.test.ts`: Schema-qualified table names and aliases formatting.
- `tests/schemaDefaultValue.test.ts`: Numeric, string, and timestamp default value extraction in schema DDL.
- `tests/cteInspectorDetails.test.ts`: CTE projections formatting and inspector drawer mapping.
- `tests/schemaClauseSplitting.test.ts`: DDL clause splitting with nested parentheses and complex types.
- `tests/checkConstraintParsing.test.ts`: Primary key and NOT NULL nullability constraint separation.
- `tests/cteNodeRendering.test.ts`: CTE node data mapping and fallback summary generation.
- `tests/commentOnlyQuery.test.ts`: Graceful handling of comment-only and whitespace-only queries with 0 error diagnostics.
- `tests/resultsTableReset.test.ts`: In-table search filter auto-reset on query execution result changes.
- `tests/csvSparseExport.test.ts`: Safe CSV generation for sparse rows, missing arrays, and null cells.
- `tests/emptyQueryDiagnostics.test.ts`: Empty query model structure and diagnostics array verification.
- `tests/paginationState.test.ts`: Page size calculation, total page counts, and boundary clamping.
- `tests/errorBoundaryReset.test.ts`: Complete cleanup of theme and panel layout dimensions during recovery reset.
- `tests/detailsPanelFormat.test.ts`: Relationship glyph and column target reference path formatting.
- `tests/dialectsLiteralProtection.test.ts`: Dialect signature detection with string literal stripping and URL immunity.
- `tests/schemaColumnSearch.test.ts`: Schema table matching by table name and column names.
- `tests/exportFilter.test.ts`: Screenshot node filter validation for overlays, panels, and controls.
- `tests/tableCardBadges.test.ts`: Primary key, unique, not null, and default badge calculation logic.
- `tests/emptySchemaHandling.test.ts`: Safe schema graph layout for empty and orphan table collections.
- `tests/formatter.test.ts`: String literal preservation and keyword formatting validation.
- `tests/subqueryLayout.test.ts`: Nested subquery node creation and DAG flow edge connectivity.
- `tests/mutationParsing.test.ts`: DML AST model parsing for `INSERT`, `UPDATE`, and `DELETE` queries.
- `tests/resultsFilter.test.ts`: In-memory multi-type row searching and null-safe filtering logic.
- `tests/diagnosticsEnhancements.test.ts`: Diagnostic suggestions, rule IDs, and error line number mapping.
- `tests/databaseCatalog.test.ts`: Verifies all 23 databases have 10 queries, validates AST parsing on all 230 queries, and executes all 230 queries against in-memory SQLite instances with 0 errors.
- `tests/export.test.ts`: CSV generator logic with nulls, booleans, objects, quotes, multiline strings, zero-column edge cases, and empty dataset pagination calculations.
- `tests/schemaParser.test.ts`: Multi-word data types, composite primary keys, foreign keys, missing indexes, schema-qualified table names.
- `tests/parser.test.ts`: Query parsing, USING clauses, multiple CTEs, comments handling, empty query handling, circular AST protection, and AST models.
- `tests/queryAnalyzer.test.ts`: AST analysis for CTEs, joins, aggregations, subqueries in FROM, order by, MySQL comma limit/offset.
- `tests/dialects.test.ts`: Dialect detection for PostgreSQL, MySQL, and SQLite.
- `tests/diagnostics.test.ts`: Diagnostics for unbounded mutations, Cartesian joins, star projections, leading wildcards, random sorting, redundant distinct, syntax errors, and USING clauses.
- `tests/theme.test.ts`: Validates light and dark theme palettes, contrast, and CSS variables.
- `tests/schemaLayout.test.ts`: Graph layout, distinct handle IDs, orphan tables.
- `tests/urlState.test.ts`: Codec encoding, hash prefixes, corruption handling, whitespace trimming, percent-encoding.
- `tests/queryLayout.test.ts`: Query flow DAG layout, CTE connections, dual table support.
