import { z } from "zod";
import { idPositivo } from "./comun.dto";

export const esquemaFiltrosAuditoria = z.object({
  id_usuario: idPositivo.optional(),
  tabla_afectada: z.string().trim().max(60).optional(),
  accion: z.string().trim().max(40).optional(),
  limite: z.coerce.number().int().min(1).max(500).default(100),
});
export type FiltrosAuditoriaDto = z.infer<typeof esquemaFiltrosAuditoria>;
