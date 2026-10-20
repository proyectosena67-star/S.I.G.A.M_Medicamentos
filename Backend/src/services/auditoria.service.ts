import { pool, Queryable } from '../config/db';
import { auditoriaRepository } from '../data/auditoria.repository';
import { FiltrosAuditoriaDto } from '../dtos/auditoria.dto';

export interface EntradaAuditoria {
  id_usuario?: number | null;
  accion: string; // máx. 20 caracteres (columna accion VARCHAR(20))
  tabla: string;
  registro_id?: number | null;
  anteriores?: unknown;
  nuevos?: unknown;
  ip?: string | null;
}

// Nunca se guardan contraseñas ni hashes en la bitácora
function limpiar(datos: unknown): string | null {
  if (datos === undefined || datos === null) return null;
  const copia = JSON.parse(JSON.stringify(datos));
  if (copia && typeof copia === 'object') {
    delete copia.password_hash;
    delete copia.password;
    delete copia.password_temporal;
  }
  return JSON.stringify(copia);
}

export const auditoriaService = {
  // `db` puede ser el pool o el client de una transacción: así el log entra en la misma transacción
  registrar(e: EntradaAuditoria, db: Queryable = pool): Promise<void> {
    return auditoriaRepository.insertar(
      {
        id_usuario: e.id_usuario ?? null,
        accion: e.accion,
        tabla_afectada: e.tabla,
        registro_id: e.registro_id ?? null,
        datos_anteriores: limpiar(e.anteriores),
        datos_nuevo: limpiar(e.nuevos),
        direccion_ip: e.ip ?? null,
      },
      db
    );
  },

  listar: (filtros: FiltrosAuditoriaDto) => auditoriaRepository.listar(filtros),
};
