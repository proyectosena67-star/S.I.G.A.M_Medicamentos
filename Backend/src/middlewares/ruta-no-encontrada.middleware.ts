import { RequestHandler } from "express";
import { ErrorNoEncontrado } from "../errors/errores-http";

export const rutaNoEncontrada: RequestHandler = (req, _res, next) => {
  next(new ErrorNoEncontrado(`La ruta ${req.method} ${req.originalUrl} no existe`));
};
