import { z } from 'zod';
import { booleanQuery, fechaSchema } from './common.dto';

export const crearPacienteDto = z.object({
  tipo_documento: z.string().trim().min(1).max(20),
  documento: z.string().trim().min(1).max(30),
  nombres: z.string().trim().min(1).max(100),
  apellidos: z.string().trim().min(1).max(100),
  fecha_nacimiento: fechaSchema.optional(),
  genero: z.string().trim().max(20).optional(),
  telefono: z.string().trim().max(30).optional(),
  correo: z.string().trim().email().max(100).optional(),
  direccion: z.string().trim().optional(),
});
export const actualizarPacienteDto = crearPacienteDto.partial();

export const filtrosPacienteDto = z.object({
  q: z.string().trim().optional(),
  estado: booleanQuery.optional(),
});

export const filtrosHistorialDto = z.object({
  estado: z.string().trim().optional(),
  desde: fechaSchema.optional(),
  hasta: fechaSchema.optional(),
});

export type CrearPacienteDto = z.infer<typeof crearPacienteDto>;
export type ActualizarPacienteDto = z.infer<typeof actualizarPacienteDto>;
export type FiltrosPacienteDto = z.infer<typeof filtrosPacienteDto>;
export type FiltrosHistorialDto = z.infer<typeof filtrosHistorialDto>;
