import { pool, Queryable } from '../config/db';
import { BadRequestError } from '../errors';

export { pool };
export type { Queryable };

export async function todas<T>(db: Queryable, sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await db.query(sql, params);
  return res.rows as T[];
}

export async function una<T>(db: Queryable, sql: string, params: unknown[] = []): Promise<T | null> {
  const filas = await todas<T>(db, sql, params);
  return filas[0] ?? null;
}

export async function unaObligatoria<T>(db: Queryable, sql: string, params: unknown[] = []): Promise<T> {
  const fila = await una<T>(db, sql, params);
  if (!fila) throw new Error('La consulta no devolvió filas');
  return fila;
}

// UPDATE dinámico: solo toca las columnas permitidas que vengan definidas en `datos`.
// `tabla`, `idCol` y `columnas` salen siempre del código, nunca del cliente.
export async function actualizarPorId<T>(
  db: Queryable,
  tabla: string,
  idCol: string,
  id: number,
  datos: Record<string, unknown>,
  columnas: readonly string[]
): Promise<T | null> {
  const sets: string[] = [];
  const valores: unknown[] = [];
  for (const col of columnas) {
    if (datos[col] !== undefined) {
      valores.push(datos[col]);
      sets.push(`${col} = $${valores.length}`);
    }
  }
  if (!sets.length) throw new BadRequestError('No hay datos para actualizar');
  valores.push(id);
  return una<T>(
    db,
    `UPDATE ${tabla} SET ${sets.join(', ')} WHERE ${idCol} = $${valores.length} RETURNING *`,
    valores
  );
}

// Constructor de WHERE con parámetros ($1, $2...). Un mismo valor puede usarse en varios "?" de la condición.
export class Condiciones {
  private partes: string[] = [];
  readonly valores: unknown[] = [];

  agregar(condicion: string, valor: unknown): this {
    this.valores.push(valor);
    this.partes.push(condicion.replace(/\?/g, `$${this.valores.length}`));
    return this;
  }

  get where(): string {
    return this.partes.length ? `WHERE ${this.partes.join(' AND ')}` : '';
  }
}
