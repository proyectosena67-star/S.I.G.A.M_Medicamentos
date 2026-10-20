export interface OrdenMedica {
  id_orden: number;
  id_usuario: number;
  id_paciente: number;
  tipo_orden: string | null;
  detalles: string | null;
  estado: string;
  fecha_creacion: Date;
}

export interface OrdenDetallada extends OrdenMedica {
  paciente: string;
  documento_paciente: string;
  medico: string;
}
