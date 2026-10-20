import { LoteContexto, LoteDetallado, LoteMedicamento, MedicamentoStockBajo } from '../models';
import { ActualizarLoteDto, CrearLoteDto, FiltrosLoteDto } from '../dtos/lote.dto';
import { actualizarPorId, Condiciones, pool, Queryable, todas, una, unaObligatoria } from './base';

export const loteRepository = {
  listar(f: FiltrosLoteDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.id_medicamento !== undefined) c.agregar('l.id_medicamento = ?', f.id_medicamento);
    return todas<LoteDetallado>(
      db,
      `SELECT l.*, m.nombre_generico, (l.fecha_vence < CURRENT_DATE) AS vencido
         FROM lotes_medicamento l JOIN medicamentos m ON m.id_medicamento = l.id_medicamento
         ${c.where} ORDER BY l.fecha_vence`,
      c.valores
    );
  },

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<LoteMedicamento>(db, 'SELECT * FROM lotes_medicamento WHERE id_lote = $1', [id]),

  // Bloquea la fila durante la transacción para que dos dispensaciones simultáneas no se pisen
  bloquearPorId: (id: number, db: Queryable) =>
    una<LoteContexto>(
      db,
      `SELECT id_lote, id_medicamento, num_lote, stock_actual, (fecha_vence < CURRENT_DATE) AS vencido
         FROM lotes_medicamento WHERE id_lote = $1 FOR UPDATE`,
      [id]
    ),

  crear: (d: CrearLoteDto, db: Queryable = pool) =>
    unaObligatoria<LoteMedicamento>(
      db,
      `INSERT INTO lotes_medicamento (id_medicamento, num_lote, fecha_vence, stock_actual)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [d.id_medicamento, d.num_lote, d.fecha_vence, d.stock_actual]
    ),

  actualizar: (id: number, d: ActualizarLoteDto, db: Queryable = pool) =>
    actualizarPorId<LoteMedicamento>(db, 'lotes_medicamento', 'id_lote', id, d, [
      'num_lote', 'fecha_vence', 'stock_actual',
    ]),

  descontarStock: (id: number, cantidad: number, db: Queryable) =>
    db.query('UPDATE lotes_medicamento SET stock_actual = stock_actual - $1 WHERE id_lote = $2', [cantidad, id]),

  medicamentosConStockBajo: (db: Queryable = pool) =>
    todas<MedicamentoStockBajo>(
      db,
      `SELECT m.id_medicamento, m.nombre_generico, m.stock_minimo,
              COALESCE(SUM(l.stock_actual) FILTER (WHERE l.fecha_vence >= CURRENT_DATE), 0)::int AS stock_total
         FROM medicamentos m LEFT JOIN lotes_medicamento l ON l.id_medicamento = m.id_medicamento
        WHERE m.estado = TRUE
        GROUP BY m.id_medicamento
       HAVING COALESCE(SUM(l.stock_actual) FILTER (WHERE l.fecha_vence >= CURRENT_DATE), 0) <= m.stock_minimo
        ORDER BY m.nombre_generico`
    ),

  vencidosConStock: (db: Queryable = pool) =>
    todas<LoteDetallado>(
      db,
      `SELECT l.*, m.nombre_generico, TRUE AS vencido
         FROM lotes_medicamento l JOIN medicamentos m ON m.id_medicamento = l.id_medicamento
        WHERE l.stock_actual > 0 AND l.fecha_vence < CURRENT_DATE ORDER BY l.fecha_vence`
    ),

  porVencer: (dias: number, db: Queryable = pool) =>
    todas<LoteDetallado>(
      db,
      `SELECT l.*, m.nombre_generico, FALSE AS vencido
         FROM lotes_medicamento l JOIN medicamentos m ON m.id_medicamento = l.id_medicamento
        WHERE l.stock_actual > 0
          AND l.fecha_vence BETWEEN CURRENT_DATE AND CURRENT_DATE + $1::int
        ORDER BY l.fecha_vence`,
      [dias]
    ),
};
