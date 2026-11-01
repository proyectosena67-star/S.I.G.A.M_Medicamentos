import { Pool, PoolClient, QueryResult, types } from "pg";
import { env } from "../config/env";

// DATE (oid 1082) se devuelve como texto "AAAA-MM-DD" para evitar corrimientos de zona horaria.
types.setTypeParser(1082, (valor: string) => valor);

export const pool = new Pool({
  host: env.baseDatos.host,
  port: env.baseDatos.puerto,
  user: env.baseDatos.usuario,
  password: env.baseDatos.clave,
  database: env.baseDatos.nombre,
});

/** Algo que sabe ejecutar consultas: el pool normal o un cliente dentro de una transacción. */
export interface Ejecutor {
  query(texto: string, valores?: unknown[]): Promise<QueryResult<any>>;
}

export async function ejecutarTransaccion<T>(trabajo: (cliente: PoolClient) => Promise<T>): Promise<T> {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    const resultado = await trabajo(cliente);
    await cliente.query("COMMIT");
    return resultado;
  } catch (error) {
    await cliente.query("ROLLBACK");
    throw error;
  } finally {
    cliente.release();
  }
}

export async function verificarConexion(): Promise<void> {
  await pool.query("SELECT 1");
}

export async function cerrarConexion(): Promise<void> {
  await pool.end();
}
