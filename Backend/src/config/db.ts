import { Pool, PoolClient, QueryResult, types } from 'pg';
import { env } from './env';

// Las columnas DATE se devuelven como 'AAAA-MM-DD' (texto) para evitar corrimientos de zona horaria
types.setTypeParser(1082, (valor: string) => valor);

export const pool = new Pool(
  env.db.url
    ? { connectionString: env.db.url }
    : {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
      }
);

// Cualquier cosa que sepa ejecutar consultas: el pool o el client de una transacción
export interface Queryable {
  query(text: string, params?: unknown[]): Promise<QueryResult<any>>;
}

// Ejecuta fn dentro de una transacción (BEGIN / COMMIT / ROLLBACK)
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await fn(client);
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
