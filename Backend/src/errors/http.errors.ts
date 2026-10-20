import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(mensaje: string, extra?: Record<string, unknown>) { super(400, mensaje, extra); }
}
export class ValidationError extends AppError {
  constructor(mensaje: string, errores: { campo: string; mensaje: string }[]) { super(400, mensaje, { errores }); }
}
export class UnauthorizedError extends AppError {
  constructor(mensaje = 'No autenticado') { super(401, mensaje); }
}
export class ForbiddenError extends AppError {
  constructor(mensaje = 'No tienes permiso para realizar esta acción') { super(403, mensaje); }
}
export class NotFoundError extends AppError {
  constructor(mensaje = 'Recurso no encontrado') { super(404, mensaje); }
}
export class ConflictError extends AppError {
  constructor(mensaje: string, extra?: Record<string, unknown>) { super(409, mensaje, extra); }
}
