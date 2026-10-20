import { Medicamento, MedicamentoConStock } from '../models';
import {
  ActualizarMedicamentoDto, CrearMedicamentoDto, FiltrosMedicamentoDto,
} from '../dtos/medicamento.dto';
import { actualizarPorId, Condiciones, pool, Queryable, todas, una, unaObligatoria } from './base';

// stock_total suma solo los lotes no vencidos; stock_bajo compara contra stock_minimo
const SELECT_STOCK = `
  SELECT m.*,
         COALESCE(SUM(l.stock_actual) FILTER (WHERE l.fecha_vence >= CURRENT_DATE), 0)::int AS stock_total,
         (COALESCE(SUM(l.stock_actual) FILTER (WHERE l.fecha_vence >= CURRENT_DATE), 0) <= m.stock_minimo) AS stock_bajo
    FROM medicamentos m LEFT JOIN lotes_medicamento l ON l.id_medicamento = m.id_medicamento`;

export const medicamentoRepository = {
  listar(f: FiltrosMedicamentoDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.q) c.agregar('(m.nombre_generico ILIKE ? OR m.nombre_comercial ILIKE ? OR m.codigo_cums ILIKE ?)', `%${f.q}%`);
    if (f.estado !== undefined) c.agregar('m.estado = ?', f.estado);
    return todas<MedicamentoConStock>(
      db,
      `${SELECT_STOCK} ${c.where} GROUP BY m.id_medicamento ORDER BY m.nombre_generico`,
      c.valores
    );
  },

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<MedicamentoConStock>(db, `${SELECT_STOCK} WHERE m.id_medicamento = $1 GROUP BY m.id_medicamento`, [id]),

  buscarBasico: (id: number, db: Queryable = pool) =>
    una<Medicamento>(db, 'SELECT * FROM medicamentos WHERE id_medicamento = $1', [id]),

  crear: (d: CrearMedicamentoDto, db: Queryable = pool) =>
    unaObligatoria<Medicamento>(
      db,
      `INSERT INTO medicamentos (codigo_cums, nombre_generico, nombre_comercial, presentacion, concentracion,
                                 via_administracion, tipo_medicamento, es_controlado, stock_minimo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [d.codigo_cums ?? null, d.nombre_generico, d.nombre_comercial ?? null, d.presentacion ?? null,
       d.concentracion ?? null, d.via_administracion ?? null, d.tipo_medicamento ?? null,
       d.es_controlado ?? false, d.stock_minimo ?? 0]
    ),

  actualizar: (id: number, d: ActualizarMedicamentoDto, db: Queryable = pool) =>
    actualizarPorId<Medicamento>(db, 'medicamentos', 'id_medicamento', id, d, [
      'codigo_cums', 'nombre_generico', 'nombre_comercial', 'presentacion', 'concentracion',
      'via_administracion', 'tipo_medicamento', 'es_controlado', 'stock_minimo',
    ]),

  cambiarEstado: (id: number, estado: boolean, db: Queryable = pool) =>
    una<Medicamento>(db, 'UPDATE medicamentos SET estado = $1 WHERE id_medicamento = $2 RETURNING *', [estado, id]),
};
