import { z } from "zod";
import { idPositivo } from "./comun.dto";

export const esquemaCrearDispensacion = z.object({
  id_detalle_orden: idPositivo,
  id_lote: idPositivo,
  cantidad_entregada: z.number().int("Debe ser un entero").positive("Debe ser mayor que cero"),
});
export type CrearDispensacionDto = z.infer<typeof esquemaCrearDispensacion>;

export const esquemaFiltrosDispensacion = z.object({ id_detalle_orden: idPositivo.optional() });
export type FiltrosDispensacionDto = z.infer<typeof esquemaFiltrosDispensacion>;
