import { z } from "zod";
import { exigirAlgunCampo, MENSAJE_SIN_CAMPOS, texto } from "./comun.dto";

export const esquemaCrearMedicamento = z.object({
  codigo_cums: texto(3, 30),
  nombre_generico: texto(2, 120),
  nombre_comercial: texto(2, 120).optional(),
  tipo_medicamento: texto(2, 80).optional(),
  es_controlado: z.boolean().default(false),
  stock_minimo: z.number().int("Debe ser un entero").min(0, "No puede ser negativo").default(0),
});
export type CrearMedicamentoDto = z.infer<typeof esquemaCrearMedicamento>;

export const esquemaActualizarMedicamento = z
  .object({
    codigo_cums: texto(3, 30),
    nombre_generico: texto(2, 120),
    nombre_comercial: texto(2, 120),
    tipo_medicamento: texto(2, 80),
    es_controlado: z.boolean(),
    stock_minimo: z.number().int().min(0),
  })
  .partial()
  .refine(exigirAlgunCampo, MENSAJE_SIN_CAMPOS);
export type ActualizarMedicamentoDto = z.infer<typeof esquemaActualizarMedicamento>;
