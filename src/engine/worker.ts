import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

export interface QueryExecutionResult {
  columns: string[];
  values: unknown[][];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export interface WorkerMessage {
  id: string;
  type: 'INIT' | 'LOAD_DB' | 'LOAD_BUFFER' | 'EXECUTE' | 'GET_SCHEMA';
  payload?: unknown;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;

  try {
    if (type === 'INIT') {
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: (file) => `./${file}`,
        });
      }
      if (!db) {
        db = new SQL.Database();
      }
      self.postMessage({ id, success: true });
      return;
    }

    if (type === 'LOAD_DB') {
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: (file) => `./${file}`,
        });
      }
      const dbPath = payload as string;
      const response = await fetch(dbPath);
      if (!response.ok) {
        throw new Error(`Failed to load database file: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      if (db) {
        db.close();
      }
      db = new SQL.Database(new Uint8Array(buffer));
      self.postMessage({ id, success: true });
      return;
    }

    if (type === 'LOAD_BUFFER') {
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: (file) => `./${file}`,
        });
      }
      const buffer = payload as ArrayBuffer;
      if (db) {
        db.close();
      }
      db = new SQL.Database(new Uint8Array(buffer));
      self.postMessage({ id, success: true });
      return;
    }

    if (type === 'EXECUTE') {
      if (!db) {
        throw new Error('No database loaded');
      }

      const sql = (payload as { sql: string }).sql;
      const startTime = performance.now();

      const results = db.exec(sql);
      const endTime = performance.now();
      const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

      if (!results || results.length === 0) {
        self.postMessage({
          id,
          success: true,
          result: {
            columns: [],
            values: [],
            executionTimeMs,
            rowCount: 0,
          },
        });
        return;
      }

      const lastResult = results[results.length - 1];
      self.postMessage({
        id,
        success: true,
        result: {
          columns: lastResult.columns,
          values: lastResult.values,
          executionTimeMs,
          rowCount: lastResult.values.length,
        },
      });
      return;
    }

    if (type === 'GET_SCHEMA') {
      if (!db) {
        throw new Error('No database loaded');
      }

      // Query sqlite_master for table definitions
      const tableQuery = "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';";
      const tableResult = db.exec(tableQuery);

      const tables: Record<string, unknown> = {};
      const foreignKeys: Array<{
        id: string;
        fromTable: string;
        fromColumn: string;
        toTable: string;
        toColumn: string;
      }> = [];

      if (tableResult && tableResult.length > 0) {
        const tableRows = tableResult[0].values;

        for (const row of tableRows) {
          const tableName = String(row[0]);
          const ddlSql = String(row[1] || '');

          // Get columns info via PRAGMA
          const colResult = db.exec(`PRAGMA table_info("${tableName}");`);
          const columns: Array<{
            name: string;
            type: string;
            nullable: boolean;
            isPrimaryKey: boolean;
            isForeignKey: boolean;
            defaultValue?: string;
          }> = [];

          if (colResult && colResult.length > 0) {
            for (const colRow of colResult[0].values) {
              columns.push({
                name: String(colRow[1]),
                type: String(colRow[2] || 'TEXT'),
                nullable: colRow[3] === 0,
                defaultValue: colRow[4] !== null ? String(colRow[4]) : undefined,
                isPrimaryKey: colRow[5] === 1,
                isForeignKey: false,
              });
            }
          }

          // Get foreign keys info via PRAGMA
          const fkResult = db.exec(`PRAGMA foreign_key_list("${tableName}");`);
          if (fkResult && fkResult.length > 0) {
            for (const fkRow of fkResult[0].values) {
              const toTable = String(fkRow[2]);
              const fromCol = String(fkRow[3]);
              const toCol = String(fkRow[4]);

              const colObj = columns.find((c) => c.name.toLowerCase() === fromCol.toLowerCase());
              if (colObj) {
                colObj.isForeignKey = true;
              }

              foreignKeys.push({
                id: `fk_${tableName}_${fromCol}_${toTable}_${toCol}`,
                fromTable: tableName,
                fromColumn: fromCol,
                toTable,
                toColumn: toCol,
              });
            }
          }

          // Get row count
          let rowCount = 0;
          try {
            const countResult = db.exec(`SELECT COUNT(*) FROM "${tableName}";`);
            if (countResult && countResult.length > 0) {
              rowCount = Number(countResult[0].values[0][0]);
            }
          } catch {
            // Count query optional
          }

          tables[tableName] = {
            name: tableName,
            columns,
            primaryKey: columns.filter((c) => c.isPrimaryKey).map((c) => c.name),
            foreignKeys: foreignKeys.filter((f) => f.fromTable === tableName),
            indexes: [],
            rowCount,
            ddlSql,
          };
        }
      }

      // Find orphan tables
      const referenced = new Set<string>();
      foreignKeys.forEach((fk) => {
        referenced.add(fk.fromTable);
        referenced.add(fk.toTable);
      });
      const orphanTables = Object.keys(tables).filter((t) => !referenced.has(t));

      self.postMessage({
        id,
        success: true,
        schema: {
          tables,
          foreignKeys,
          orphanTables,
          missingIndexFkColumns: [],
        },
      });
      return;
    }

    throw new Error(`Unknown message type: ${type}`);
  } catch (error: unknown) {
    const err = error as Error;
    self.postMessage({
      id,
      success: false,
      error: err.message || 'Worker execution error',
    });
  }
};
