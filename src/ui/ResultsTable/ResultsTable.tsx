import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  Clock,
  Rows,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { QueryExecutionResult } from '../../engine/worker';
import styles from './ResultsTable.module.css';

interface ResultsTableProps {
  result: QueryExecutionResult | null;
  error?: string | null;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, error }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [copied, setCopied] = useState(false);

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!result || !result.columns) return [];
    return result.columns.map((colName, colIdx) => ({
      accessorKey: `col_${colIdx}`,
      header: colName,
      cell: (info) => {
        const val = info.getValue();
        if (val === null || val === undefined) {
          return <span style={{ color: 'var(--text-muted, #6b7280)', fontStyle: 'italic' }}>NULL</span>;
        }
        if (typeof val === 'boolean') {
          return String(val).toUpperCase();
        }
        return String(val);
      },
    }));
  }, [result]);

  const data = useMemo<Record<string, unknown>[]>(() => {
    if (!result || !result.values) return [];
    return result.values.map((row) => {
      const rowObj: Record<string, unknown> = {};
      row.forEach((cell, idx) => {
        rowObj[`col_${idx}`] = cell;
      });
      return rowObj;
    });
  }, [result]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 50 },
    },
  });

  const generateCsv = (): string => {
    if (!result || result.columns.length === 0) return '';
    const header = result.columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
    const rows = result.values
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null || cell === undefined) return '';
            const cellStr = String(cell).replace(/"/g, '""');
            return `"${cellStr}"`;
          })
          .join(',')
      )
      .join('\n');
    return `${header}\n${rows}`;
  };

  const handleCopyCsv = () => {
    const csv = generateCsv();
    if (!csv) return;
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csv = generateCsv();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query-results-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Query Error</span>
        </div>
        <div className={styles.errorState}>
          <AlertCircle size={16} />
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Results</span>
        </div>
        <div className={styles.emptyState}>
          <div>Execute query (Ctrl+Enter) to view results table</div>
        </div>
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.statsGroup}>
            <div className={styles.statItem}>
              <Clock size={13} />
              <span>Time:</span>
              <span className={styles.statValue}>{result.executionTimeMs} ms</span>
            </div>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div>Query executed successfully. 0 rows returned.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.statsGroup}>
          <div className={styles.statItem}>
            <Rows size={13} />
            <span>Rows:</span>
            <span className={styles.statValue}>{result.rowCount}</span>
          </div>
          <div className={styles.statItem}>
            <Clock size={13} />
            <span>Time:</span>
            <span className={styles.statValue}>{result.executionTimeMs} ms</span>
          </div>
        </div>

        <div className={styles.actionsGroup}>
          <button className={styles.csvButton} onClick={handleCopyCsv} title="Copy results as CSV to clipboard">
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy CSV'}</span>
          </button>
          <button className={styles.csvButton} onClick={handleDownloadCsv} title="Download results as a CSV file">
            <Copy size={12} />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={styles.th}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUp size={11} color="var(--accent, #3b82f6)" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDown size={11} color="var(--accent, #3b82f6)" />
                      ) : (
                        <ArrowUpDown size={11} color="var(--text-muted, #6b7280)" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            style={{
              background: 'var(--bg-secondary, #161d27)',
              color: 'var(--text-secondary, #9ca3af)',
              border: '1px solid var(--border, #2a3649)',
              borderRadius: 4,
              fontSize: 11,
              padding: '2px 6px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} rows / page
              </option>
            ))}
          </select>
        </div>

        {table.getPageCount() > 1 && (
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="First page"
            >
              <ChevronsLeft size={13} />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Previous page"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Next page"
            >
              <ChevronRight size={13} />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="Last page"
            >
              <ChevronsRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
