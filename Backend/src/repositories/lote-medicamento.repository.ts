import { Ejecutor, pool } from "../data/base-datos";
import { LoteMedicamento } from "../models/lote-medicamento.model";
import { RepositorioBase } from "./repositorio.base";

class LoteMedicamentoRepository extends RepositorioBase<LoteMedicamento> {
  constructor() {
    super("lotes_medicamento", "id_lote", [
      "id_medicamento", "id_via", "id_presentacion", "num_lote", "fecha_vence", "stock_actual",
    ]);
  }

  /** Bloquea la fila durante la transacción para que dos dispensaciones no gasten el mismo stock. */
  async buscarParaActualizar(id: number, ejecutor: Ejecutor): Promise<LoteMedicamento | null> {
    const resultado = await ejecutor.query(`SELECT * FROM lotes_medicamento WHERE id_lote = $1 FOR UPDATE`, [id]);
    return resultado.rows[0] ?? null;
  }

  async descontarStock(id: number, cantidad: number, ejecutor: Ejecutor): Promise<void> {
    await ejecutor.query(`UPDATE lotes_medicamento SET stock_actual = stock_actual - $1 WHERE id_lote = $2`, [cantidad, id]);
  }

  async listarConMedicamento(ejecutor: Ejecutor = pool): Promise<(LoteMedicamento & { medicamento: string })[]> {
    const resultado = await ejecutor.query(
      `SELECT l.*, m.nombre_generico AS medicamento
       FROM lotes_medicamento l JOIN medicamentos m ON m.id_medicamento = l.id_medicamento
       ORDER BY l.fecha_vence, l.id_lote`
    );
    return resultado.rows;
  }
}

export const loteMedicamentoRepository = new LoteMedicamentoRepository();
