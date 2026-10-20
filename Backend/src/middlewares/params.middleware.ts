import { RequestParamHandler } from 'express';
import { BadRequestError } from '../errors';

// router.param('id', validarId): evita que un id no numérico llegue a la base de datos
export const validarId: RequestParamHandler = (_req, _res, next, valor) => {
  if (!/^\d+$/.test(String(valor))) return next(new BadRequestError('Id inválido'));
  next();
};
