import { z } from "zod";
import { exigirAlgunCampo, fechaISO, idPositivo, MENSAJE_SIN_CAMPOS, texto } from "./comun.dto";

export const esquemaCrearLote = z.object({
  id_medicamento: idPositivo,
  id_via: idPositivo,
  id_presentacion: idPositivo,
  num_lote: texto(1, 40),
  fecha_vence: fechaISO,
  stock_actual: z.number().int("Debe ser un entero").min(0, "No puede ser negativo"),
});
export type CrearLoteDto = z.infer<typeof esquemaCrearLote>;

export const esquemaActualizarLote = esquemaCrearLote.partial().refine(exigirAlgunCampo, MENSAJE_SIN_CAMPOS);
export type ActualizarLoteDto = z.infer<typeof esquemaActualizarLote>;
