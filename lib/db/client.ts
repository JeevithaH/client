/**
 * ==============================================================================
 * CLOUDFLARE D1 PRIMARY DATABASE CLIENT
 * ==============================================================================
 * 
 * Purpose:
 *   Universal, high-performance Cloudflare D1 Serverless SQL client.
 *   Acts as the single source of truth for Shipfold Luxury Atelier.
 * 
 * Execution Modes:
 *   1. Cloudflare Native Edge: Uses native `env.DB` binding when deployed
 *      to Cloudflare Pages / Workers.
 *   2. Node.js HTTPS REST: Communicates directly with Cloudflare D1's REST
 *      API (/client/v4/accounts/.../d1/database/.../query) during local development
 *      and standard server runtimes.
 *   3. Resilience: Gracefully captures API errors and logs clear diagnostic guidance.
 * ==============================================================================
 */

import https from 'https';

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
  error?: string;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

/**
 * Resolves Cloudflare D1 credentials from environment variables.
 */
export function getD1Config(): D1Config {
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '0839521948261b01860d7ef69559689b',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '54f10dac-3872-4b21-9985-944c63bff784',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_D1_API_TOKEN || '',
  };
}

/**
 * Checks whether remote Cloudflare D1 credentials are set in the environment.
 */
export function isD1Configured(): boolean {
  const { accountId, databaseId, apiToken } = getD1Config();
  return Boolean(accountId && databaseId && apiToken);
}

/**
 * Internal REST API executor for Cloudflare D1.
 */
async function executeD1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<D1Result<T>> {
  const { accountId, databaseId, apiToken } = getD1Config();

  if (!accountId || !databaseId || !apiToken) {
    return {
      results: [],
      success: false,
      error: 'Missing Cloudflare D1 credentials (CLOUDFLARE_API_TOKEN / ACCOUNT_ID).',
    };
  }

  // D1 REST API expects sql and params array
  const postData = JSON.stringify({ sql, params });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.success && Array.isArray(json.result) && json.result.length > 0) {
              const queryResult = json.result[0];
              resolve({
                results: (queryResult.results || []) as T[],
                success: true,
                meta: queryResult.meta,
              });
            } else {
              const err = json.errors?.[0]?.message || 'D1 API returned execution failure';
              resolve({
                results: [],
                success: false,
                error: err,
              });
            }
          } catch {
            resolve({
              results: [],
              success: false,
              error: 'Failed to parse JSON response from Cloudflare D1 REST API.',
            });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        results: [],
        success: false,
        error: `Cloudflare D1 Network Error: ${err.message}`,
      });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Universal D1 Statement implementation that works in Node.js or Cloudflare Edge.
 */
class UniversalD1Statement implements D1PreparedStatement {
  private query: string;
  private params: unknown[] = [];

  constructor(query: string, params: unknown[] = []) {
    this.query = query;
    this.params = params;
  }

  bind(...values: unknown[]): D1PreparedStatement {
    return new UniversalD1Statement(this.query, values);
  }

  async first<T = Record<string, unknown>>(colName?: string): Promise<T | null> {
    const res = await this.all<T>();
    if (!res.success || res.results.length === 0) return null;
    const row = res.results[0];
    if (colName && typeof row === 'object' && row !== null) {
      return (row as Record<string, unknown>)[colName] as T ?? null;
    }
    return row;
  }

  async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    // Check if Cloudflare Edge native binding exists
    const nativeDb = (globalThis as unknown as { DB?: D1Database }).DB;
    if (nativeDb && typeof nativeDb.prepare === 'function') {
      try {
        const stmt = nativeDb.prepare(this.query).bind(...this.params);
        return (await stmt.all<T>()) as D1Result<T>;
      } catch (err: unknown) {
        return {
          results: [],
          success: false,
          error: (err as Error).message,
        };
      }
    }

    // Otherwise use Cloudflare D1 HTTPS REST API
    const res = await executeD1Query<T>(this.query, this.params);
    if (!res.success) {
      console.error(`[Cloudflare D1 Query Error]: ${res.error} | SQL: ${this.query}`);
    }
    return res;
  }

  async run<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    const res = await this.all<T>();
    if (!res.success) {
      throw new Error(`D1 execution error: ${res.error}`);
    }
    return res;
  }
}

/**
 * Universal D1 Database client singleton.
 */
class UniversalD1Database implements D1Database {
  prepare(query: string): D1PreparedStatement {
    return new UniversalD1Statement(query);
  }

  async batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const results: D1Result<T>[] = [];
    for (const stmt of statements) {
      results.push(await stmt.all<T>());
    }
    return results;
  }

  async exec(query: string): Promise<{ count: number; duration: number }> {
    const res = await executeD1Query(query);
    return {
      count: res.results.length,
      duration: Number(res.meta?.duration || 0),
    };
  }
}

const d1Singleton = new UniversalD1Database();

/**
 * Returns the primary Cloudflare D1 database client.
 * 
 * @returns {D1Database} Cloudflare D1 single source of truth database instance.
 */
export function getDb(): D1Database {
  return d1Singleton;
}

export const db = d1Singleton;
