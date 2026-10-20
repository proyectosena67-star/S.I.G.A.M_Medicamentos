import { z } from 'zod';

export const idSchema = z.number().int().positive();
export const idQuery = z.coerce.number().int().positive();
export const fechaSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'debe tener formato AAAA-MM-DD');
export const booleanQuery = z.enum(['true', 'false']).transform((v) => v === 'true');

export const estadoDto = z.object({ estado: z.boolean() });
export type EstadoDto = z.infer<typeof estadoDto>;
