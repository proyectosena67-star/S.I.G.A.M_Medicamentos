import { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// permitir('Administrador', 'Médico') -> solo esos roles pasan
export const permitir = (...roles: string[]): RequestHandler => {
  const permitidos = roles.map(norm);
  return (req, _res, next) => {
    if (!req.user) return next(new UnauthorizedError('Debes iniciar sesión'));
    if (!permitidos.includes(norm(req.user.rol))) return next(new ForbiddenError());
    next();
  };
};
