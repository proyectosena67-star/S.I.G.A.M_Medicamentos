import { RequestHandler } from "express";
import { auditoriaService } from "../services/auditoria.service";
import { obtenerIp } from "../utils/respuestas";

/**
 * Registra en auditoria_logs la acción cuando la respuesta termina con éxito.
 * El controller puede dejar en res.locals: registroId, datosAnteriores y datosNuevos.
 * Si no deja datosNuevos, se guarda el body de la petición (sin contraseñas).
 */
export const auditarAccion =
  (accion: string, tablaAfectada: string): RequestHandler =>
  (req, res, next) => {
    res.on("finish", () => {
      if (res.statusCode >= 400) return;
      auditoriaService
        .registrar({
          id_usuario: req.usuario?.id_usuario ?? null,
          accion,
          tabla_afectada: tablaAfectada,
          registro_id: res.locals.registroId ?? null,
          datos_anteriores: res.locals.datosAnteriores,
          datos_nuevo: res.locals.datosNuevos ?? req.body,
          direccion_ip: obtenerIp(req),
        })
        .catch((error) => console.error("No se pudo registrar la auditoría:", error));
    });
    next();
  };
