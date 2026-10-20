import { z } from 'zod';
import { fechaSchema, idQuery, idSchema } from './common.dto';
import { itemOrdenDto } from './detalleOrden.dto';

export const crearOrdenDto = z.object({
  id_paciente: idSchema,
  tipo_orden: z.string().trim().max(50).optional(),
  detalles: z.string().trim().optional(),
  items: z.array(itemOrdenDto).min(1),
});

// Modificar una orden activa exige justificación
export const editarOrdenDto = z.object({
  justificacion: z.string().trim().min(1),
  tipo_orden: z.string().trim().max(50).optional(),
  detalles: z.string().trim().optional(),
  items: z.array(itemOrdenDto).min(1).optional(),
});

export const estadoOrdenDto = z.object({
  estado: z.enum(['Finalizada', 'Cancelada']),
  justificacion: z.string().trim().min(1),
});

export const filtrosOrdenDto = z.object({
  id_paciente: idQuery.optional(),
  estado: z.string().trim().optional(),
  desde: fechaSchema.optional(),
  hasta: fechaSchema.optional(),
});

export type CrearOrdenDto = z.infer<typeof crearOrdenDto>;
export type EditarOrdenDto = z.infer<typeof editarOrdenDto>;
export type EstadoOrdenDto = z.infer<typeof estadoOrdenDto>;
export type FiltrosOrdenDto = z.infer<typeof filtrosOrdenDto>;
