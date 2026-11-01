import { Ejecutor, pool } from "../data/base-datos";
import { Dispensacion } from "../models/dispensacion.model";
import { FiltrosDispensacionDto } from "../dtos/dispensacion.dto";
import { RepositorioBase } from "./repositorio.base";

class DispensacionRepository extends RepositorioBase<Dispensacion> {
  constructor() {
    super("dispensaciones", "id_dispensacion", ["id_detalle_orden", "id_lote", "id_farmaceuta", "cantidad_entregada"]);
  }

  async listarConFiltros(filtros: FiltrosDispensacionDto, ejecutor: Ejecutor = pool) {
    const resultado = await ejecutor.query(
      `SELECT s.*, l.num_lote, m.nombre_generico AS medicamento,
              f.nombres || ' ' || f.apellidos AS farmaceuta
       FROM dispensaciones s
       JOIN lotes_medicamento l ON l.id_lote = s.id_lote
       JOIN medicamentos m ON m.id_medicamento = l.id_medicamento
       JOIN usuarios f ON f.id_usuario = s.id_farmaceuta
       WHERE ($1::int IS NULL OR s.id_detalle_orden = $1)
       ORDER BY s.id_dispensacion DESC`,
      [filtros.id_detalle_orden ?? null]
    );
    return resultado.rows;
  }
}

export const dispensacionRepository = new DispensacionRepository();
