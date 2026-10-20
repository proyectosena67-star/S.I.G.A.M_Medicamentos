import { z } from 'zod';
import { fechaSchema, idQuery } from './common.dto';

export const filtrosAuditoriaDto = z.object({
  id_usuario: idQuery.optional(),
  tabla: z.string().trim().optional(),
  accion: z.string().trim().optional(),
  desde: fechaSchema.optional(),
  hasta: fechaSchema.optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

export type FiltrosAuditoriaDto = z.infer<typeof filtrosAuditoriaDto>;
