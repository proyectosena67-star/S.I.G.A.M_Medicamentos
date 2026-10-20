import { z } from 'zod';
import { idQuery, idSchema } from './common.dto';

export const crearDispensacionDto = z.object({
  id_detalle_orden: idSchema,
  id_lote: idSchema,
  cantidad_entregada: z.number().int().positive(),
  confirmar_controlado: z.boolean().optional(),
});

export const filtrosDispensacionDto = z.object({ id_orden: idQuery.optional() });

export type CrearDispensacionDto = z.infer<typeof crearDispensacionDto>;
export type FiltrosDispensacionDto = z.infer<typeof filtrosDispensacionDto>;
