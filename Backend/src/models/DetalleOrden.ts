export interface DetalleOrden {
  id_detalle_orden: number;
  id_orden: number;
  id_medicamento: number;
  cantidad: number;
  tiempo: string | null;
  observaciones: string | null;
}

export interface DetalleOrdenDetallado extends DetalleOrden {
  nombre_generico: string;
  via_administracion: string | null;
  es_controlado: boolean;
  cantidad_dispensada: number;
  aplicaciones: number;
}

export interface ContextoDispensacion {
  id_detalle_orden: number;
  id_medicamento: number;
  cantidad: number;
  estado_orden: string;
  nombre_generico: string;
  es_controlado: boolean;
}

export interface ContextoAplicacion {
  id_detalle_orden: number;
  estado_orden: string;
  nombre_generico: string;
  via_medicamento: string | null;
  dispensado: number;
}
