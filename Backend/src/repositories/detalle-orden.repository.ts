import { Ejecutor, pool } from "../data/base-datos";
import { DetalleOrden } from "../models/detalle-orden.model";
import { RepositorioBase } from "./repositorio.base";

class DetalleOrdenRepository extends RepositorioBase<DetalleOrden> {
  constructor() {
    super("detalle_orden", "id_detalle_orden", [
      "id_orden", "id_medicamento", "id_via", "id_presentacion",
      "frecuencia_horas", "total_aplicaciones", "fecha_inicio", "observaciones",
    ]);
  }

  async listarPorOrden(idOrden: number, ejecutor: Ejecutor = pool): Promise<DetalleOrden[]> {
    const resultado = await ejecutor.query(
      `SELECT d.*, m.nombre_generico, m.nombre_comercial, v.nombre AS via
       FROM detalle_orden d
       JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
       JOIN via_administracion v ON v.id_via = d.id_via
       WHERE d.id_orden = $1
       ORDER BY d.id_detalle_orden`,
      [idOrden]
    );
    return resultado.rows;
  }
}

export const detalleOrdenRepository = new DetalleOrdenRepository();
