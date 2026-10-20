import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, codigoDb } from '../errors';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, ...(err.extra ?? {}) });
  }

  switch (codigoDb(err)) {
    case '23505': return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
    case '23503': return res.status(400).json({ error: 'Referencia a un registro que no existe' });
    case '23514':
      return res.status(400).json({ error: 'Un valor no cumple las reglas de la base de datos (cantidad o stock inválidos)' });
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
