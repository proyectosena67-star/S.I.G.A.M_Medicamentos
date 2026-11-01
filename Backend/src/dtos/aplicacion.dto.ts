import { z } from "zod";
import { ESTADOS_APLICACION } from "../config/constantes";
import { idPositivo, texto } from "./comun.dto";

export const esquemaAsignarEnfermero = z.object({ id_enfermero: idPositivo });
export type AsignarEnfermeroDto = z.infer<typeof esquemaAsignarEnfermero>;

export const esquemaRegistrarAplicacion = z
  .object({
    estado: z.enum(["administrada", "omitida"], { errorMap: () => ({ message: "Estado inválido. Usa: administrada u omitida" }) }),
    observacion: texto(1, 500).optional(),
  })
  .refine((d) => d.estado !== "omitida" || !!d.observacion, {
    message: "Debes indicar el motivo en 'observacion' cuando la dosis se omite",
    path: ["observacion"],
  });
export type RegistrarAplicacionDto = z.infer<typeof esquemaRegistrarAplicacion>;

export const esquemaFiltrosAplicacion = z.object({
  estado: z.enum(ESTADOS_APLICACION).optional(),
  id_orden: idPositivo.optional(),
  id_paciente: idPositivo.optional(),
  id_enfermero: idPositivo.optional(),
});
export type FiltrosAplicacionDto = z.infer<typeof esquemaFiltrosAplicacion>;
