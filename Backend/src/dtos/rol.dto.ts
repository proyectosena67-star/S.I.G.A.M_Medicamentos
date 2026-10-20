import { z } from 'zod';

export const crearRolDto = z.object({
  nombre: z.string().trim().min(1).max(50),
  descripcion: z.string().trim().optional(),
});
export const actualizarRolDto = crearRolDto.partial();

export type CrearRolDto = z.infer<typeof crearRolDto>;
export type ActualizarRolDto = z.infer<typeof actualizarRolDto>;
