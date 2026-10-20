import { z } from 'zod';

export const loginDto = z.object({
  correo: z.string().trim().min(1),
  password: z.string().min(1),
});

export const actualizarPerfilDto = z.object({
  telefono: z.string().trim().max(30).optional(),
  correo: z.string().trim().toLowerCase().email().max(100).optional(),
});

export const cambiarPasswordDto = z.object({
  actual: z.string().min(1),
  nueva: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, 'debe incluir al menos una letra')
    .regex(/\d/, 'debe incluir al menos un número'),
});

export type LoginDto = z.infer<typeof loginDto>;
export type ActualizarPerfilDto = z.infer<typeof actualizarPerfilDto>;
export type CambiarPasswordDto = z.infer<typeof cambiarPasswordDto>;
