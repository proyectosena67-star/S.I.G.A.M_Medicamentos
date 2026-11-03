import { Ejecutor, pool } from "../data/base-datos";

/**
 * Operaciones comunes de acceso a datos (listar, buscar, crear, actualizar).
 * Cada repositorio indica su tabla, su llave primaria y qué columnas se pueden escribir.
 * Los nombres de columna salen de código propio, nunca del usuario, por eso es seguro interpolarlos.
 */
export abstract class RepositorioBase<TModelo> {
  protected constructor(
    protected readonly tabla: string,
    protected readonly columnaId: string,
    protected readonly columnasEditables: readonly string[],
    protected readonly columnasLectura: string = "*"
  ) {}

  async listar(ejecutor: Ejecutor = pool): Promise<TModelo[]> {
    const resultado = await ejecutor.query(
      `SELECT ${this.columnasLectura} FROM ${this.tabla} ORDER BY ${this.columnaId}`
    );
    return resultado.rows;
  }

  async buscarPorId(id: number, ejecutor: Ejecutor = pool): Promise<TModelo | null> {
    const resultado = await ejecutor.query(
      `SELECT ${this.columnasLectura} FROM ${this.tabla} WHERE ${this.columnaId} = $1`,
      [id]
    );
    return resultado.rows[0] ?? null;
  }

  async crear(datos: object, ejecutor: Ejecutor = pool): Promise<TModelo> {
    const valores = datos as Record<string, unknown>;
    const columnas = this.columnasEditables.filter((c) => valores[c] !== undefined);
    if (columnas.length === 0) throw new Error(`No hay datos para insertar en ${this.tabla}`);

    const marcadores = columnas.map((_, i) => `$${i + 1}`).join(", ");
    const resultado = await ejecutor.query(
      `INSERT INTO ${this.tabla} (${columnas.join(", ")}) VALUES (${marcadores}) RETURNING ${this.columnasLectura}`,
      columnas.map((c) => valores[c])
    );
    return resultado.rows[0];
  }

  async actualizar(id: number, datos: object, ejecutor: Ejecutor = pool): Promise<TModelo | null> {
    const valores = datos as Record<string, unknown>;
    const columnas = this.columnasEditables.filter((c) => valores[c] !== undefined);
    if (columnas.length === 0) return this.buscarPorId(id, ejecutor);

    const asignaciones = columnas.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const resultado = await ejecutor.query(
      `UPDATE ${this.tabla} SET ${asignaciones} WHERE ${this.columnaId} = $${columnas.length + 1} RETURNING ${this.columnasLectura}`,
      [...columnas.map((c) => valores[c]), id]
    );
    return resultado.rows[0] ?? null;
  }
}
