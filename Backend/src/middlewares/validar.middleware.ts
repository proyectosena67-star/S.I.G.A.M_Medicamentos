import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import { esquemaId } from "../dtos/comun.dto";
import { ErrorSolicitudInvalida } from "../errors/errores-http";

type Origen = "body" | "query" | "params";

/**
 * Valida el body, la query o los params con un esquema zod.
 * - body: reemplaza req.body por los datos ya limpios y tipados.
 * - query: deja los datos limpios en res.locals.query.
 */
export const validar =
  (esquema: ZodTypeAny, origen: Origen = "body"): RequestHandler =>
  (req, res, next) => {
    const resultado = esquema.safeParse(req[origen]);
    if (!resultado.success) {
      const detalles = resultado.error.issues.map((problema) => ({
        campo: problema.path.join("."),
        mensaje: problema.message,
      }));
      return next(new ErrorSolicitudInvalida("Datos inválidos", detalles));
    }
    if (origen === "body") req.body = resultado.data;
    if (origen === "query") res.locals.query = resultado.data;
    next();
  };

/** Valida que el parámetro :id de la ruta sea un entero positivo. */
export const validarId = validar(esquemaId, "params");
