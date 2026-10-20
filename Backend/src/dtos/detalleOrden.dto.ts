import { z } from 'zod';
import { idQuery, idSchema } from './common.dto';

export const itemOrdenDto = z.object({
  id_medicamento: idSchema,
  cantidad: z.number().int().positive(),
  tiempo: z.string().trim().max(100).optional(),
  observaciones: z.string().trim().optional(),
});

export const filtrosDetalleOrdenDto = z.object({ id_orden: idQuery });

export type ItemOrdenDto = z.infer<typeof itemOrdenDto>;
export type FiltrosDetalleOrdenDto = z.infer<typeof filtrosDetalleOrdenDto>;
