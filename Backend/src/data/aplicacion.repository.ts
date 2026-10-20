import { Aplicacion, AplicacionDetallada, LineaPendienteAplicacion } from '../models';
import { FiltrosAplicacionDto } from '../dtos/aplicacion.dto';
import { Condiciones, pool, Queryable, todas, unaObligatoria } from './base';

const SELECT = `
  SELECT a.*, d.id_orden, m.nombre_generico, u.nombres || ' ' || u.apellidos AS enfermero
    FROM aplicacion a
    JOIN detalle_orden d ON d.id_detalle_orden = a.id_detalle_orden
    JOIN orden_medica o ON o.id_orden = d.id_orden
    JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
    JOIN usuarios u ON u.id_usuario = a.id_usuario`;

export const aplicacionRepository = {
  crear: (
    d: {
      id_detalle_orden: number; id_usuario: number; fecha_hora_aplicacion?: string;
      via_administracion: string | null; observacion: string | null;
    },
    db: Queryable = pool
  ) =>
    unaObligatoria<Aplicacion>(
      db,
      `INSERT INTO aplicacion (id_detalle_orden, id_usuario, fecha_hora_aplicacion, via_administracion, observacion)
       VALUES ($1, $2, COALESCE($3::timestamp, CURRENT_TIMESTAMP), $4, $5) RETURNING *`,
      [d.id_detalle_orden, d.id_usuario, d.fecha_hora_aplicacion ?? null, d.via_administracion, d.observacion]
    ),

  // Líneas de órdenes activas con medicamento ya dispensado
  pendientes: (db: Queryable = pool) =>
    todas<LineaPendienteAplicacion>(
      db,
      `SELECT d.id_detalle_orden, d.id_orden, d.cantidad, d.tiempo, d.observaciones,
              m.nombre_generico, m.via_administracion, p.nombres || ' ' || p.apellidos AS paciente,
              COALESCE(SUM(x.cantidad_entregada), 0)::int AS cantidad_dispensada
         FROM detalle_orden d
         JOIN orden_medica o ON o.id_orden = d.id_orden
         JOIN pacientes p ON p.id_paciente = o.id_paciente
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
         JOIN dispensaciones x ON x.id_detalle_orden = d.id_detalle_orden
        WHERE o.estado = 'Activa'
        GROUP BY d.id_detalle_orden, m.id_medicamento, p.id_paciente
        ORDER BY d.id_orden`
    ),

  listar(f: FiltrosAplicacionDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.id_detalle_orden !== undefined) c.agregar('a.id_detalle_orden = ?', f.id_detalle_orden);
    if (f.id_paciente !== undefined) c.agregar('o.id_paciente = ?', f.id_paciente);
    return todas<AplicacionDetallada>(
      db,
      `${SELECT} ${c.where} ORDER BY a.fecha_hora_aplicacion DESC LIMIT 200`,
      c.valores
    );
  },

  listarPorDetalles: (ids: number[], db: Queryable = pool) =>
    todas<AplicacionDetallada>(
      db,
      `${SELECT} WHERE a.id_detalle_orden = ANY($1) ORDER BY a.fecha_hora_aplicacion`,
      [ids]
    ),
};
