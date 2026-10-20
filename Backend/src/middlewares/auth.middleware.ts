import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepository } from '../data/usuario.repository';
import { UnauthorizedError } from '../errors';
import { asyncHandler } from '../utils/http';

// Verifica el token y que el usuario y su rol sigan activos: si el administrador
// desactiva a alguien, pierde el acceso aunque su token no haya vencido.
export const autenticar = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new UnauthorizedError('Debes iniciar sesión');

  const payload = jwt.verify(token, env.jwtSecret()) as jwt.JwtPayload;
  const u = await usuarioRepository.buscarAuth(Number(payload.sub));
  if (!u || !u.estado || !u.rol_estado) throw new UnauthorizedError('Usuario inactivo o inexistente');

  req.user = { id: u.id_usuario, correo: u.correo, rol: u.rol };
  next();
});
