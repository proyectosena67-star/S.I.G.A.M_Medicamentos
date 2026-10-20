import { OrdenDetallada, OrdenMedica } from '../models';
import { CrearOrdenDto, FiltrosOrdenDto } from '../dtos/orden.dto';
import { actualizarPorId, Condiciones, pool, Queryable, todas, una, unaObligatoria } from './base';

const SELECT = `
  SELECT o.*, p.nombres || ' ' || p.apellidos AS paciente, p.documento AS documento_paciente,
         u.nombres || ' ' || u.apellidos AS medico
    FROM orden_medica o
    JOIN pacientes p ON p.id_paciente = o.id_paciente
    JOIN usuarios u ON u.id_usuario = o.id_usuario`;

export const ordenRepository = {
  listar(f: FiltrosOrdenDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.id_paciente !== undefined) c.agregar('o.id_paciente = ?', f.id_paciente);
    if (f.estado) c.agregar('o.estado = ?', f.estado);
    if (f.desde) c.agregar('o.fecha_creacion >= ?', f.desde);
    if (f.hasta) c.agregar("o.fecha_creacion < (?::date + INTERVAL '1 day')", f.hasta);
    return todas<OrdenDetallada>(db, `${SELECT} ${c.where} ORDER BY o.fecha_creacion DESC LIMIT 200`, c.valores);
  },

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<OrdenDetallada>(db, `${SELECT} WHERE o.id_orden = $1`, [id]),

  bloquearPorId: (id: number, db: Queryable) =>
    una<OrdenMedica>(db, 'SELECT * FROM orden_medica WHERE id_orden = $1 FOR UPDATE', [id]),

  crear: (idMedico: number, d: Pick<CrearOrdenDto, 'id_paciente' | 'tipo_orden' | 'detalles'>, db: Queryable = pool) =>
    unaObligatoria<OrdenMedica>(
      db,
      `INSERT INTO orden_medica (id_usuario, id_paciente, tipo_orden, detalles)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [idMedico, d.id_paciente, d.tipo_orden ?? null, d.detalles ?? null]
    ),

  actualizar: (id: number, d: { tipo_orden?: string; detalles?: string }, db: Queryable = pool) =>
    actualizarPorId<OrdenMedica>(db, 'orden_medica', 'id_orden', id, d, ['tipo_orden', 'detalles']),

  cambiarEstado: (id: number, estado: string, db: Queryable = pool) =>
    unaObligatoria<OrdenMedica>(db, 'UPDATE orden_medica SET estado = $1 WHERE id_orden = $2 RETURNING *', [estado, id]),
};
