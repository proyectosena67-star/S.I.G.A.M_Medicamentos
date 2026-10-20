import { Dispensacion, DispensacionDetallada, LineaPendienteDispensacion } from '../models';
import { FiltrosDispensacionDto } from '../dtos/dispensacion.dto';
import { Condiciones, pool, Queryable, todas, unaObligatoria } from './base';

export const dispensacionRepository = {
  crear: (
    d: { id_detalle_orden: number; id_lote: number; id_farmaceuta: number; cantidad_entregada: number },
    db: Queryable = pool
  ) =>
    unaObligatoria<Dispensacion>(
      db,
      `INSERT INTO dispensaciones (id_detalle_orden, id_lote, id_farmaceuta, cantidad_entregada)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [d.id_detalle_orden, d.id_lote, d.id_farmaceuta, d.cantidad_entregada]
    ),

  sumaDispensada: async (idDetalle: number, db: Queryable = pool): Promise<number> => {
    const r = await db.query(
      `SELECT COALESCE(SUM(cantidad_entregada), 0)::int AS total
         FROM dispensaciones WHERE id_detalle_orden = $1`,
      [idDetalle]
    );
    return r.rows[0].total as number;
  },

  // Líneas de órdenes activas a las que todavía les falta cantidad por dispensar
  pendientes: (db: Queryable = pool) =>
    todas<LineaPendienteDispensacion>(
      db,
      `SELECT d.id_detalle_orden, d.id_orden, d.cantidad, d.tiempo, d.observaciones,
              m.id_medicamento, m.nombre_generico, m.es_controlado,
              p.nombres || ' ' || p.apellidos AS paciente, o.fecha_creacion,
              COALESCE(SUM(x.cantidad_entregada), 0)::int AS cantidad_dispensada
         FROM detalle_orden d
         JOIN orden_medica o ON o.id_orden = d.id_orden
         JOIN pacientes p ON p.id_paciente = o.id_paciente
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
         LEFT JOIN dispensaciones x ON x.id_detalle_orden = d.id_detalle_orden
        WHERE o.estado = 'Activa'
        GROUP BY d.id_detalle_orden, m.id_medicamento, o.id_orden, p.id_paciente
       HAVING COALESCE(SUM(x.cantidad_entregada), 0) < d.cantidad
        ORDER BY o.fecha_creacion`
    ),

  listar(f: FiltrosDispensacionDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.id_orden !== undefined) c.agregar('d.id_orden = ?', f.id_orden);
    return todas<DispensacionDetallada>(
      db,
      `SELECT x.*, d.id_orden, l.num_lote, m.nombre_generico, u.nombres || ' ' || u.apellidos AS farmaceuta
         FROM dispensaciones x
         JOIN detalle_orden d ON d.id_detalle_orden = x.id_detalle_orden
         JOIN lotes_medicamento l ON l.id_lote = x.id_lote
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
         JOIN usuarios u ON u.id_usuario = x.id_farmaceuta
         ${c.where} ORDER BY x.fecha_dispensacion DESC LIMIT 200`,
      c.valores
    );
  },

  listarPorDetalles: (ids: number[], db: Queryable = pool) =>
    todas<DispensacionDetallada>(
      db,
      `SELECT x.*, d.id_orden, l.num_lote, m.nombre_generico, u.nombres || ' ' || u.apellidos AS farmaceuta
         FROM dispensaciones x
         JOIN detalle_orden d ON d.id_detalle_orden = x.id_detalle_orden
         JOIN lotes_medicamento l ON l.id_lote = x.id_lote
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
         JOIN usuarios u ON u.id_usuario = x.id_farmaceuta
        WHERE x.id_detalle_orden = ANY($1) ORDER BY x.fecha_dispensacion`,
      [ids]
    ),
};
