import { z } from 'zod';
import { booleanQuery, idQuery, idSchema } from './common.dto';

export const crearUsuarioDto = z.object({
  id_rol: idSchema,
  tipo_documento: z.string().trim().min(1).max(20),
  documento: z.string().trim().min(1).max(30),
  nombres: z.string().trim().min(1).max(100),
  apellidos: z.string().trim().min(1).max(100),
  correo: z.string().trim().toLowerCase().email().max(100),
  telefono: z.string().trim().max(30).optional(),
  especialidad: z.string().trim().max(100).optional(),
});
export const actualizarUsuarioDto = crearUsuarioDto.partial();

export const filtrosUsuarioDto = z.object({
  q: z.string().trim().optional(),
  estado: booleanQuery.optional(),
  id_rol: idQuery.optional(),
});

export type CrearUsuarioDto = z.infer<typeof crearUsuarioDto>;
export type ActualizarUsuarioDto = z.infer<typeof actualizarUsuarioDto>;
export type FiltrosUsuarioDto = z.infer<typeof filtrosUsuarioDto>;
