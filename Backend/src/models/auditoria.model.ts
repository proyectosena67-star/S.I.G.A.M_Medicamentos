export interface RegistroAuditoria {
  id_log: number;
  id_usuario: number | null;
  accion: string;
  tabla_afectada: string;
  registro_id: number | null;
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  direccion_ip: string | null;
  fecha_hora: Date;
  usuario?: string | null;
}
