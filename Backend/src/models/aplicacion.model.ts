import { EstadoAplicacion } from "../config/constantes";

export interface Aplicacion {
  id_aplicacion: number;
  id_detalle_orden: number;
  id_enfermero: number | null;
  fecha_hora_programada: Date;
  fecha_hora_aplicacion: Date | null;
  estado: EstadoAplicacion;
  observacion: string | null;
  // Campos que llegan al consultar con los datos del paciente y el medicamento
  id_orden?: number;
  id_paciente?: number;
  paciente?: string;
  medicamento?: string;
  via?: string;
  enfermero?: string | null;
}
