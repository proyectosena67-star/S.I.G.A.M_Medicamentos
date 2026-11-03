import { Ejecutor, pool } from "../data/base-datos";
import { RegistroAuditoria } from "../models/auditoria.model";
import { FiltrosAuditoriaDto } from "../dtos/auditoria.dto";
import { RepositorioBase } from "./repositorio.base";

class AuditoriaRepository extends RepositorioBase<RegistroAuditoria> {
  constructor() {
    super("auditoria_logs", "id_log", [
      "id_usuario", "accion", "tabla_afectada", "registro_id", "datos_anteriores", "datos_nuevo", "direccion_ip",
    ]);
  }

  async listarConFiltros(filtros: FiltrosAuditoriaDto, ejecutor: Ejecutor = pool): Promise<RegistroAuditoria[]> {
    const resultado = await ejecutor.query(
      `SELECT a.*, u.correo AS usuario
       FROM auditoria_logs a
       LEFT JOIN usuarios u ON u.id_usuario = a.id_usuario
       WHERE ($1::int IS NULL OR a.id_usuario = $1)
         AND ($2::text IS NULL OR a.tabla_afectada = $2)
         AND ($3::text IS NULL OR a.accion = $3)
       ORDER BY a.fecha_hora DESC, a.id_log DESC
       LIMIT $4`,
      [filtros.id_usuario ?? null, filtros.tabla_afectada ?? null, filtros.accion ?? null, filtros.limite]
    );
    return resultado.rows;
  }
}

export const auditoriaRepository = new AuditoriaRepository();
