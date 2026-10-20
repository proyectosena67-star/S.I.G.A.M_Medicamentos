export interface LoteMedicamento {
  id_lote: number;
  id_medicamento: number;
  num_lote: string;
  fecha_vence: string;
  stock_actual: number;
}

export interface LoteDetallado extends LoteMedicamento {
  nombre_generico: string;
  vencido: boolean;
}

export interface LoteContexto {
  id_lote: number;
  id_medicamento: number;
  num_lote: string;
  stock_actual: number;
  vencido: boolean;
}

export interface MedicamentoStockBajo {
  id_medicamento: number;
  nombre_generico: string;
  stock_minimo: number;
  stock_total: number;
}
