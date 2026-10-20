import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthUser } from '../types/auth';
import { UnauthorizedError } from '../errors';

// Express 4 no captura errores de funciones async: este wrapper los manda al middleware de errores
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export function usuarioActual(req: Request): AuthUser {
  if (!req.user) throw new UnauthorizedError('Debes iniciar sesión');
  return req.user;
}

export const idDe = (req: Request, nombre = 'id'): number => Number(req.params[nombre]);
