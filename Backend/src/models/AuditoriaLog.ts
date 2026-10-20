export interface AuditoriaLog {
  id_log: number;
  id_usuario: number | null;
  accion: string;
  tabla_afectada: string;
  registro_id: number | null;
  datos_anteriores: string | null;
  datos_nuevo: string | null;
  direccion_ip: string | null;
  fecha_hora: Date;
}

export interface AuditoriaDetallada extends AuditoriaLog {
  usuario: string | null;
}
