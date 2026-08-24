import { QueryExecutionResult } from './worker';
import { SchemaModel } from '../model/schema';

class SqlEngineClient {
  private worker: Worker | null = null;
  private pendingRequests: Map<
    string,
    { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
  > = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  public async init(): Promise<void> {
    if (this.isInitialized && this.worker) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        // Instantiate worker with Vite worker constructor
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

        this.worker.onmessage = (event: MessageEvent) => {
          const { id, success, result, schema, error } = event.data;
          const request = this.pendingRequests.get(id);

          if (request) {
            this.pendingRequests.delete(id);
            if (success) {
              resolveRequest(request.resolve, { result, schema });
            } else {
              request.reject(new Error(error || 'Worker request failed'));
            }
          }
        };

        this.worker.onerror = (error) => {
          console.error('Worker error:', error);
        };

        const baseUrl = import.meta.env.BASE_URL || './';
        const wasmUrl = new URL(`${baseUrl}sql-wasm.wasm`, window.location.href).href;

        await this.sendRequest('INIT', { wasmUrl });
        this.isInitialized = true;
      } catch (err) {
        this.initPromise = null;
        this.worker = null;
        this.isInitialized = false;
        throw err;
      }
    })();

    return this.initPromise;
  }

  public async loadDatabase(dbPath: string): Promise<void> {
    await this.init();
    try {
      const baseUrl = import.meta.env.BASE_URL || './';
      const cleanPath = dbPath.replace(/^\.\//, '');
      const fullUrl = new URL(`${baseUrl}${cleanPath}`, window.location.href).href;

      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to load database: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      await this.sendRequest('LOAD_BUFFER', buffer);
    } catch {
      // Fallback: try loading directly via path
      await this.sendRequest('LOAD_DB', dbPath);
    }
  }

  public async loadDatabaseBuffer(buffer: ArrayBuffer): Promise<void> {
    await this.init();
    await this.sendRequest('LOAD_BUFFER', buffer);
  }

  public async executeQuery(sql: string): Promise<QueryExecutionResult> {
    await this.init();
    const response = (await this.sendRequest('EXECUTE', { sql })) as {
      result: QueryExecutionResult;
    };
    return response.result;
  }

  public async getSchema(): Promise<SchemaModel> {
    await this.init();
    const response = (await this.sendRequest('GET_SCHEMA')) as { schema: SchemaModel };
    return response.schema;
  }

  private sendRequest(type: string, payload?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.pendingRequests.set(id, { resolve, reject });
      this.worker?.postMessage({ id, type, payload });
    });
  }
}

function resolveRequest(resolve: (value: unknown) => void, data: { result?: unknown; schema?: unknown }) {
  if (data.result !== undefined) {
    resolve({ result: data.result });
  } else if (data.schema !== undefined) {
    resolve({ schema: data.schema });
  } else {
    resolve({ success: true });
  }
}

export const sqlEngine = new SqlEngineClient();
