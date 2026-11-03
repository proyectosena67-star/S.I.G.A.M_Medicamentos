import { RequestHandler } from "express";
import { NombreRol } from "../config/constantes";
import { ErrorNoAutenticado, ErrorProhibido } from "../errors/errores-http";

/** Deja pasar solo a los usuarios cuyo rol esté en la lista. Debe ir después de `autenticar`. */
export const autorizarRoles =
  (...rolesPermitidos: NombreRol[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.usuario) return next(new ErrorNoAutenticado("Token no proporcionado"));
    if (!(rolesPermitidos as string[]).includes(req.usuario.rol)) return next(new ErrorProhibido());
    next();
  };
