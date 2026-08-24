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
      const wasmUrl = (payload as { wasmUrl?: string })?.wasmUrl;
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: (file) => wasmUrl || `./${file}`,
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
              const toCol =
                fkRow[4] !== null && fkRow[4] !== undefined && String(fkRow[4]) !== 'null'
                  ? String(fkRow[4])
                  : 'id';

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

          // Get table indexes via PRAGMA
          const indexes: Array<{ name: string; columns: string[]; isUnique: boolean }> = [];
          try {
            const indexListResult = db.exec(`PRAGMA index_list("${tableName}");`);
            if (indexListResult && indexListResult.length > 0) {
              for (const idxRow of indexListResult[0].values) {
                const idxName = String(idxRow[1]);
                const isUnique = idxRow[2] === 1;
                const idxCols: string[] = [];

                const infoResult = db.exec(`PRAGMA index_info("${idxName}");`);
                if (infoResult && infoResult.length > 0) {
                  for (const infoRow of infoResult[0].values) {
                    idxCols.push(String(infoRow[2]));
                  }
                }

                indexes.push({
                  name: idxName,
                  columns: idxCols,
                  isUnique,
                });
              }
            }
          } catch {
            // Index pragma optional
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
            indexes,
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

      // Find missing index on FK columns
      const missingIndexFkColumns: Array<{ table: string; column: string }> = [];
      foreignKeys.forEach((fk) => {
        const tableObj = tables[fk.fromTable] as {
          indexes?: Array<{ columns: string[] }>;
          primaryKey?: string[];
        } | undefined;

        if (tableObj) {
          const hasIdx = tableObj.indexes?.some((idx) =>
            idx.columns.some((c) => c.toLowerCase() === fk.fromColumn.toLowerCase())
          );
          const isPk = tableObj.primaryKey?.some((pk) => pk.toLowerCase() === fk.fromColumn.toLowerCase());
          if (!hasIdx && !isPk) {
            missingIndexFkColumns.push({
              table: fk.fromTable,
              column: fk.fromColumn,
            });
          }
        }
      });

      self.postMessage({
        id,
        success: true,
        schema: {
          tables,
          foreignKeys,
          orphanTables,
          missingIndexFkColumns,
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
