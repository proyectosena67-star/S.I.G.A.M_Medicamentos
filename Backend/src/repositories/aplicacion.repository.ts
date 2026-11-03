import { Ejecutor, pool } from "../data/base-datos";
import { Aplicacion } from "../models/aplicacion.model";
import { FiltrosAplicacionDto } from "../dtos/aplicacion.dto";
import { RepositorioBase } from "./repositorio.base";

const SELECT_APLICACION = `
  SELECT a.id_aplicacion, a.id_detalle_orden, a.id_enfermero, a.fecha_hora_programada,
         a.fecha_hora_aplicacion, a.estado, a.observacion,
         o.id_orden, p.id_paciente,
         p.nombres || ' ' || p.apellidos AS paciente,
         m.nombre_generico AS medicamento,
         v.nombre AS via,
         e.nombres || ' ' || e.apellidos AS enfermero
  FROM aplicacion a
  JOIN detalle_orden d ON d.id_detalle_orden = a.id_detalle_orden
  JOIN orden_medica o ON o.id_orden = d.id_orden
  JOIN pacientes p ON p.id_paciente = o.id_paciente
  JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
  JOIN via_administracion v ON v.id_via = d.id_via
  LEFT JOIN usuarios e ON e.id_usuario = a.id_enfermero`;

class AplicacionRepository extends RepositorioBase<Aplicacion> {
  constructor() {
    super("aplicacion", "id_aplicacion", [
      "id_detalle_orden", "id_enfermero", "fecha_hora_programada", "fecha_hora_aplicacion", "estado", "observacion",
    ]);
  }

  async listarConFiltros(filtros: FiltrosAplicacionDto, ejecutor: Ejecutor = pool): Promise<Aplicacion[]> {
    const resultado = await ejecutor.query(
      `${SELECT_APLICACION}
       WHERE ($1::int IS NULL OR a.id_enfermero = $1)
         AND ($2::text IS NULL OR a.estado = $2)
         AND ($3::int IS NULL OR o.id_orden = $3)
         AND ($4::int IS NULL OR p.id_paciente = $4)
       ORDER BY a.fecha_hora_programada, a.id_aplicacion`,
      [filtros.id_enfermero ?? null, filtros.estado ?? null, filtros.id_orden ?? null, filtros.id_paciente ?? null]
    );
    return resultado.rows;
  }

  async buscarConDetalle(id: number, ejecutor: Ejecutor = pool): Promise<Aplicacion | null> {
    const resultado = await ejecutor.query(`${SELECT_APLICACION} WHERE a.id_aplicacion = $1`, [id]);
    return resultado.rows[0] ?? null;
  }

  /** Al cancelar una orden, sus dosis pendientes también se cancelan. */
  async cancelarPendientesDeOrden(idOrden: number, ejecutor: Ejecutor = pool): Promise<void> {
    await ejecutor.query(
      `UPDATE aplicacion SET estado = 'omitida'
        WHERE estado = 'pendiente'
         AND id_detalle_orden IN (SELECT id_detalle_orden FROM detalle_orden WHERE id_orden = $1)`,
      [idOrden]
    );
  }
}

export const aplicacionRepository = new AplicacionRepository();
