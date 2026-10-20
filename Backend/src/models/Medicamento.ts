export interface Medicamento {
  id_medicamento: number;
  codigo_cums: string | null;
  nombre_generico: string;
  nombre_comercial: string | null;
  presentacion: string | null;
  concentracion: string | null;
  via_administracion: string | null;
  tipo_medicamento: string | null;
  es_controlado: boolean;
  stock_minimo: number;
  estado: boolean;
}

// stock_total suma solo los lotes no vencidos; stock_bajo = stock_total <= stock_minimo
export interface MedicamentoConStock extends Medicamento {
  stock_total: number;
  stock_bajo: boolean;
}
