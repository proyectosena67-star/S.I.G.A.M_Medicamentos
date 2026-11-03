import { EstadoOrden } from "../config/constantes";

export interface OrdenMedica {
  id_orden: number;
  id_usuario: number;
  id_paciente: number;
  detalles: string | null;
  estado: EstadoOrden;
  fecha_creacion: Date;
  paciente?: string;
  medico?: string;
}
