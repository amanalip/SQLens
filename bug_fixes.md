# Bug Fixes Log

## Fix 1: React Flow Provider Initialization Error

- **Issue**: Blank screen rendered on page load.
- **Root Cause**: `useReactFlow()` hook called inside canvas subcomponents without an enclosing `ReactFlowProvider` context.
- **Resolution**: Wrapped `QueryFlowCanvas` and `SchemaFlowCanvas` components in `ReactFlowProvider`.
- **Files Modified**:
  - `src/graph/QueryFlowCanvas.tsx`
  - `src/graph/SchemaFlowCanvas.tsx`

---

## Fix 2: WebAssembly and SQLite Asset Path Resolution

- **Issue**: Relative paths for `sql-wasm.wasm` and `.sqlite` database files failed to resolve when deployed under subpaths (such as GitHub Pages repository path).
- **Root Cause**: Worker script in assets directory attempted to resolve `./databases/` and `./sql-wasm.wasm` relative to the worker script origin rather than the configured application base path.
- **Resolution**: Main thread now computes full asset URLs with `import.meta.env.BASE_URL`, passes the resolved WASM URL to the worker on initialization, and loads database buffers via `fetch` before passing to SQLite.
- **Files Modified**:
  - `src/engine/client.ts`
  - `src/engine/worker.ts`

---

## Fix 3: Global Error Boundary

- **Issue**: Any unhandled render error resulted in an unhandled React component unmount without user feedback.
- **Resolution**: Created top-level `ErrorBoundary` component that catches exceptions and renders a helpful error card with a reload action.
- **Files Modified**:
  - `src/ErrorBoundary.tsx`
  - `src/main.tsx`
