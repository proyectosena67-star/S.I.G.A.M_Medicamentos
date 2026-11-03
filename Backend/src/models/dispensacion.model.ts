export interface Dispensacion {
  id_dispensacion: number;
  id_detalle_orden: number;
  id_lote: number;
  id_farmaceuta: number;
  cantidad_entregada: number;
  fecha_dispensacion: Date;
}
