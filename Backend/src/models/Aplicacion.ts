export interface Aplicacion {
  id_aplicacion: number;
  id_detalle_orden: number;
  id_usuario: number;
  fecha_hora_aplicacion: Date;
  via_administracion: string | null;
  observacion: string | null;
}

export interface AplicacionDetallada extends Aplicacion {
  nombre_generico: string;
  enfermero: string;
}

export interface LineaPendienteAplicacion {
  id_detalle_orden: number;
  id_orden: number;
  cantidad: number;
  tiempo: string | null;
  observaciones: string | null;
  nombre_generico: string;
  via_administracion: string | null;
  paciente: string;
  cantidad_dispensada: number;
}
