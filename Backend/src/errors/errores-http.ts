import { ErrorApp } from "./error-app";

export class ErrorSolicitudInvalida extends ErrorApp {
  constructor(mensaje = "Solicitud inválida", detalles?: unknown) {
    super(400, mensaje, detalles);
  }
}

export class ErrorNoAutenticado extends ErrorApp {
  constructor(mensaje = "No autenticado") {
    super(401, mensaje);
  }
}

export class ErrorProhibido extends ErrorApp {
  constructor(mensaje = "No tienes permisos para realizar esta acción") {
    super(403, mensaje);
  }
}

export class ErrorNoEncontrado extends ErrorApp {
  constructor(mensaje = "Recurso no encontrado") {
    super(404, mensaje);
  }
}

export class ErrorConflicto extends ErrorApp {
  constructor(mensaje = "Conflicto con el estado actual del recurso", detalles?: unknown) {
    super(409, mensaje, detalles);
  }
}
