import { z } from 'zod';
import { fechaSchema, idQuery, idSchema } from './common.dto';

export const crearLoteDto = z.object({
  id_medicamento: idSchema,
  num_lote: z.string().trim().min(1).max(50),
  fecha_vence: fechaSchema,
  stock_actual: z.number().int().min(0),
});
export const actualizarLoteDto = crearLoteDto.omit({ id_medicamento: true }).partial();

export const filtrosLoteDto = z.object({ id_medicamento: idQuery.optional() });

export type CrearLoteDto = z.infer<typeof crearLoteDto>;
export type ActualizarLoteDto = z.infer<typeof actualizarLoteDto>;
export type FiltrosLoteDto = z.infer<typeof filtrosLoteDto>;
