import { NextFunction, Request, RequestHandler, Response } from "express";

/** Envuelve un controller async para que cualquier error llegue al manejador de errores. */
export const envolver =
  (funcion: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    funcion(req, res, next).catch(next);
  };
