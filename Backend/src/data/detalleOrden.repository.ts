import {
  ContextoAplicacion, ContextoDispensacion, DetalleOrden, DetalleOrdenDetallado,
} from '../models';
import { ItemOrdenDto } from '../dtos/detalleOrden.dto';
import { pool, Queryable, todas, una, unaObligatoria } from './base';

const SELECT = `
  SELECT d.*, m.nombre_generico, m.via_administracion, m.es_controlado,
         COALESCE((SELECT SUM(x.cantidad_entregada) FROM dispensaciones x
                    WHERE x.id_detalle_orden = d.id_detalle_orden), 0)::int AS cantidad_dispensada,
         (SELECT COUNT(*) FROM aplicacion a WHERE a.id_detalle_orden = d.id_detalle_orden)::int AS aplicaciones
    FROM detalle_orden d JOIN medicamentos m ON m.id_medicamento = d.id_medicamento`;

export const detalleOrdenRepository = {
  listarPorOrden: (idOrden: number, db: Queryable = pool) =>
    todas<DetalleOrdenDetallado>(db, `${SELECT} WHERE d.id_orden = $1 ORDER BY d.id_detalle_orden`, [idOrden]),

  listarPorOrdenes: (ids: number[], db: Queryable = pool) =>
    todas<DetalleOrdenDetallado>(db, `${SELECT} WHERE d.id_orden = ANY($1) ORDER BY d.id_detalle_orden`, [ids]),

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<DetalleOrdenDetallado>(db, `${SELECT} WHERE d.id_detalle_orden = $1`, [id]),

  crear: (idOrden: number, it: ItemOrdenDto, db: Queryable = pool) =>
    unaObligatoria<DetalleOrden>(
      db,
      `INSERT INTO detalle_orden (id_orden, id_medicamento, cantidad, tiempo, observaciones)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [idOrden, it.id_medicamento, it.cantidad, it.tiempo ?? null, it.observaciones ?? null]
    ),

  eliminarPorOrden: (idOrden: number, db: Queryable = pool) =>
    db.query('DELETE FROM detalle_orden WHERE id_orden = $1', [idOrden]),

  // ¿Alguna línea de la orden ya tiene dispensaciones o aplicaciones?
  tieneMovimientos: async (idOrden: number, db: Queryable = pool): Promise<boolean> => {
    const r = await db.query(
      `SELECT 1 FROM detalle_orden d
        WHERE d.id_orden = $1
          AND (EXISTS (SELECT 1 FROM dispensaciones x WHERE x.id_detalle_orden = d.id_detalle_orden)
            OR EXISTS (SELECT 1 FROM aplicacion a WHERE a.id_detalle_orden = d.id_detalle_orden))
        LIMIT 1`,
      [idOrden]
    );
    return (r.rowCount ?? 0) > 0;
  },

  // Bloquea la línea durante la transacción de dispensación
  bloquearParaDispensar: (id: number, db: Queryable) =>
    una<ContextoDispensacion>(
      db,
      `SELECT d.id_detalle_orden, d.id_medicamento, d.cantidad, o.estado AS estado_orden,
              m.nombre_generico, m.es_controlado
         FROM detalle_orden d
         JOIN orden_medica o ON o.id_orden = d.id_orden
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
        WHERE d.id_detalle_orden = $1 FOR UPDATE OF d`,
      [id]
    ),

  contextoAplicacion: (id: number, db: Queryable = pool) =>
    una<ContextoAplicacion>(
      db,
      `SELECT d.id_detalle_orden, o.estado AS estado_orden, m.nombre_generico,
              m.via_administracion AS via_medicamento,
              COALESCE((SELECT SUM(x.cantidad_entregada) FROM dispensaciones x
                         WHERE x.id_detalle_orden = d.id_detalle_orden), 0)::int AS dispensado
         FROM detalle_orden d
         JOIN orden_medica o ON o.id_orden = d.id_orden
         JOIN medicamentos m ON m.id_medicamento = d.id_medicamento
        WHERE d.id_detalle_orden = $1`,
      [id]
    ),
};
