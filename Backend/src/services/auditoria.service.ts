import { auditoriaRepository } from "../repositories/auditoria.repository";
import { FiltrosAuditoriaDto } from "../dtos/auditoria.dto";
import { quitarCamposSensibles } from "../utils/quitar-campos-sensibles";

export interface EntradaAuditoria {
  id_usuario: number | null;
  accion: string;
  tabla_afectada: string;
  registro_id?: number | null;
  datos_anteriores?: unknown;
  datos_nuevo?: unknown;
  direccion_ip: string;
}

export const auditoriaService = {
  async registrar(entrada: EntradaAuditoria): Promise<void> {
    await auditoriaRepository.crear({
      id_usuario: entrada.id_usuario,
      accion: entrada.accion,
      tabla_afectada: entrada.tabla_afectada,
      registro_id: entrada.registro_id ?? null,
      datos_anteriores: quitarCamposSensibles(entrada.datos_anteriores),
      datos_nuevo: quitarCamposSensibles(entrada.datos_nuevo),
      direccion_ip: entrada.direccion_ip,
    });
  },

  listar(filtros: FiltrosAuditoriaDto) {
    return auditoriaRepository.listarConFiltros(filtros);
  },
};
