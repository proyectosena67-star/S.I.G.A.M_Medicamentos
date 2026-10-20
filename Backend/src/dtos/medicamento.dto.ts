import { z } from 'zod';
import { booleanQuery } from './common.dto';

export const crearMedicamentoDto = z.object({
  codigo_cums: z.string().trim().min(1).max(50).optional(),
  nombre_generico: z.string().trim().min(1).max(150),
  nombre_comercial: z.string().trim().max(150).optional(),
  presentacion: z.string().trim().max(100).optional(),
  concentracion: z.string().trim().max(100).optional(),
  via_administracion: z.string().trim().max(100).optional(),
  tipo_medicamento: z.string().trim().max(100).optional(),
  es_controlado: z.boolean().optional(),
  stock_minimo: z.number().int().min(0).optional(),
});
export const actualizarMedicamentoDto = crearMedicamentoDto.partial();

export const filtrosMedicamentoDto = z.object({
  q: z.string().trim().optional(),
  estado: booleanQuery.optional(),
});

export type CrearMedicamentoDto = z.infer<typeof crearMedicamentoDto>;
export type ActualizarMedicamentoDto = z.infer<typeof actualizarMedicamentoDto>;
export type FiltrosMedicamentoDto = z.infer<typeof filtrosMedicamentoDto>;
