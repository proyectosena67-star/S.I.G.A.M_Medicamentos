import { AuditoriaDetallada } from '../models';
import { FiltrosAuditoriaDto } from '../dtos/auditoria.dto';
import { Condiciones, pool, Queryable, todas } from './base';

export interface NuevaAuditoria {
  id_usuario: number | null;
  accion: string;
  tabla_afectada: string;
  registro_id: number | null;
  datos_anteriores: string | null;
  datos_nuevo: string | null;
  direccion_ip: string | null;
}

export const auditoriaRepository = {
  // Solo existe insertar y listar: no hay forma de editar ni borrar desde el código
  insertar: async (a: NuevaAuditoria, db: Queryable = pool): Promise<void> => {
    await db.query(
      `INSERT INTO auditoria_logs
         (id_usuario, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevo, direccion_ip)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [a.id_usuario, a.accion, a.tabla_afectada, a.registro_id, a.datos_anteriores, a.datos_nuevo, a.direccion_ip]
    );
  },

  async listar(f: FiltrosAuditoriaDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.id_usuario !== undefined) c.agregar('a.id_usuario = ?', f.id_usuario);
    if (f.tabla) c.agregar('a.tabla_afectada = ?', f.tabla);
    if (f.accion) c.agregar('a.accion = ?', f.accion);
    if (f.desde) c.agregar('a.fecha_hora >= ?', f.desde);
    if (f.hasta) c.agregar("a.fecha_hora < (?::date + INTERVAL '1 day')", f.hasta);

    const registros = await todas<AuditoriaDetallada>(
      db,
      `SELECT a.*, u.nombres || ' ' || u.apellidos AS usuario
         FROM auditoria_logs a LEFT JOIN usuarios u ON u.id_usuario = a.id_usuario
         ${c.where} ORDER BY a.fecha_hora DESC, a.id_log DESC
        LIMIT ${f.limit} OFFSET ${f.offset}`,
      c.valores
    );
    const total = await db.query(`SELECT COUNT(*)::int AS n FROM auditoria_logs a ${c.where}`, c.valores);
    return { total: total.rows[0].n as number, registros };
  },
};
