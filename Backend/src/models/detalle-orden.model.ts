export interface DetalleOrden {
  id_detalle_orden: number;
  id_orden: number;
  id_medicamento: number;
  id_via: number;
  id_presentacion: number;
  frecuencia_horas: number;
  total_aplicaciones: number;
  fecha_inicio: Date;
  observaciones: string | null;
  nombre_generico?: string;
  nombre_comercial?: string | null;
  via?: string;
}
