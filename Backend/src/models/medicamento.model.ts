export interface Medicamento {
  id_medicamento: number;
  codigo_cums: string;
  nombre_generico: string;
  nombre_comercial: string | null;
  tipo_medicamento: string | null;
  es_controlado: boolean;
  stock_minimo: number;
  estado: boolean;
}
