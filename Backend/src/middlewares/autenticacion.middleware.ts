import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ErrorNoAutenticado, ErrorProhibido } from "../errors/errores-http";
import { PayloadToken } from "../models/auth.model";
import { usuarioRepository } from "../repositories/usuario.repository";
import { envolver } from "./envolver-async";

/**
 * Exige un token Bearer válido. Consulta el usuario en la base de datos en cada petición,
 * así una cuenta desactivada o un cambio de rol surten efecto de inmediato.
 */
export const autenticar: RequestHandler = envolver(async (req, _res, next) => {
  const cabecera = req.headers.authorization;
  if (!cabecera?.startsWith("Bearer ")) throw new ErrorNoAutenticado("Token no proporcionado");

  let payload: PayloadToken;
  try {
    payload = jwt.verify(cabecera.slice(7), env.jwt.secreto) as unknown as PayloadToken;
  } catch {
    throw new ErrorNoAutenticado("Token inválido o vencido");
  }

  const usuario = await usuarioRepository.buscarPorId(payload.id_usuario);
  if (!usuario) throw new ErrorNoAutenticado("El usuario del token ya no existe");
  if (!usuario.estado) throw new ErrorProhibido("La cuenta está inactiva. Contacta al administrador");

  req.usuario = {
    id_usuario: usuario.id_usuario,
    id_rol: usuario.id_rol,
    rol: usuario.rol ?? "",
    correo: usuario.correo,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
  };
  next();
});
