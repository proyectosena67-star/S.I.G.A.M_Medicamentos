import { z } from "zod";
import { ESTADOS_ORDEN } from "../config/constantes";
import { idPositivo, texto } from "./comun.dto";

export const esquemaItemOrden = z.object({
  id_medicamento: idPositivo,
  id_via: idPositivo,
  id_presentacion: idPositivo,
  frecuencia_horas: z.number().int().min(1, "Mínimo 1 hora").max(168, "Máximo 168 horas"),
  total_aplicaciones: z.number().int().min(1, "Mínimo 1 aplicación").max(500, "Máximo 500 aplicaciones"),
  fecha_inicio: z.coerce.date({ invalid_type_error: "Fecha de inicio inválida" }).optional(),
  observaciones: texto(1, 500).optional(),
});
export type ItemOrdenDto = z.infer<typeof esquemaItemOrden>;

export const esquemaCrearOrden = z.object({
  id_paciente: idPositivo,
  detalles: texto(1, 500).optional(),
  medicamentos: z.array(esquemaItemOrden).min(1, "La orden debe tener al menos un medicamento").max(20),
});
export type CrearOrdenDto = z.infer<typeof esquemaCrearOrden>;

export const esquemaCambiarEstadoOrden = z.object({
  estado: z.enum(ESTADOS_ORDEN, { errorMap: () => ({ message: `Estado inválido. Usa: ${ESTADOS_ORDEN.join(", ")}` }) }),
});
export type CambiarEstadoOrdenDto = z.infer<typeof esquemaCambiarEstadoOrden>;

export const esquemaFiltrosOrden = z.object({
  id_paciente: idPositivo.optional(),
  estado: z.enum(ESTADOS_ORDEN).optional(),
});
export type FiltrosOrdenDto = z.infer<typeof esquemaFiltrosOrden>;
