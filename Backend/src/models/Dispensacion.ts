export interface Dispensacion {
  id_dispensacion: number;
  id_detalle_orden: number;
  id_lote: number;
  id_farmaceuta: number;
  cantidad_entregada: number;
  fecha_dispensacion: Date;
}

export interface DispensacionDetallada extends Dispensacion {
  id_orden: number;
  num_lote: string;
  nombre_generico: string;
  farmaceuta: string;
}

export interface LineaPendienteDispensacion {
  id_detalle_orden: number;
  id_orden: number;
  cantidad: number;
  tiempo: string | null;
  observaciones: string | null;
  id_medicamento: number;
  nombre_generico: string;
  es_controlado: boolean;
  paciente: string;
  fecha_creacion: Date;
  cantidad_dispensada: number;
}
