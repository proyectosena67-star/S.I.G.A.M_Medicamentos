import { z } from 'zod';
import { idQuery, idSchema } from './common.dto';

export const crearAplicacionDto = z.object({
  id_detalle_orden: idSchema,
  via_administracion: z.string().trim().max(100).optional(),
  observacion: z.string().trim().optional(),
  fecha_hora_aplicacion: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'debe ser una fecha y hora válidas')
    .optional(),
});

export const filtrosAplicacionDto = z.object({
  id_detalle_orden: idQuery.optional(),
  id_paciente: idQuery.optional(),
});

export type CrearAplicacionDto = z.infer<typeof crearAplicacionDto>;
export type FiltrosAplicacionDto = z.infer<typeof filtrosAplicacionDto>;
