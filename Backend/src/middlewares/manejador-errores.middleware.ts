import { ErrorRequestHandler } from "express";
import { esProduccion } from "../config/env";
import { ErrorApp } from "../errors/error-app";
import { traducirErrorBaseDatos } from "../errors/traductor-errores-bd";

export const manejadorErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  // JSON mal formado en el body
  if (error?.type === "entity.parse.failed") {
    res.status(400).json({ ok: false, mensaje: "El cuerpo de la petición no es un JSON válido" });
    return;
  }

  const controlado = error instanceof ErrorApp ? error : traducirErrorBaseDatos(error);
  if (controlado) {
    res.status(controlado.estado).json({
      ok: false,
      mensaje: controlado.message,
      ...(controlado.detalles ? { detalles: controlado.detalles } : {}),
    });
    return;
  }

  console.error("Error no controlado:", error);
  res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor",
    ...(esProduccion ? {} : { detalle: String(error?.message ?? error) }),
  });
};
