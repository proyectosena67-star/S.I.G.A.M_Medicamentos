import { ErrorApp } from "./error-app";
import { ErrorConflicto, ErrorSolicitudInvalida } from "./errores-http";

interface ErrorPostgres {
  code?: string;
  constraint?: string;
  column?: string;
}

/** Convierte errores de PostgreSQL en errores HTTP claros. Devuelve null si no es un error de BD conocido. */
export function traducirErrorBaseDatos(error: unknown): ErrorApp | null {
  const e = error as ErrorPostgres;
  switch (e?.code) {
    case "23505":
      return new ErrorConflicto("Ya existe un registro con esos datos", { restriccion: e.constraint });
    case "23503":
      return new ErrorSolicitudInvalida("Hace referencia a un registro que no existe o que está en uso", {
        restriccion: e.constraint,
      });
    case "23502":
      return new ErrorSolicitudInvalida(`El campo ${e.column ?? ""} es obligatorio`.replace("  ", " "));
    case "23514":
      return new ErrorSolicitudInvalida("Un valor enviado no está permitido", { restriccion: e.constraint });
    case "22P02":
    case "22007":
    case "22008":
      return new ErrorSolicitudInvalida("Uno de los datos enviados tiene un formato inválido");
    default:
      return null;
  }
}
