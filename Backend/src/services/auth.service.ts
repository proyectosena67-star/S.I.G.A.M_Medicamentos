import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { usuarioRepository } from '../data/usuario.repository';
import { ActualizarPerfilDto, CambiarPasswordDto, LoginDto } from '../dtos/auth.dto';
import { duplicadoComo, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const authService = {
  async login(dto: LoginDto, ip?: string) {
    const u = await usuarioRepository.buscarParaLogin(dto.correo);
    if (!u || !(await bcrypt.compare(dto.password, u.password_hash))) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }
    if (!u.estado || !u.rol_estado) throw new ForbiddenError('Usuario inactivo');

    const token = jwt.sign({ sub: String(u.id_usuario), rol: u.rol }, env.jwtSecret(), {
      expiresIn: env.jwtExpires as jwt.SignOptions['expiresIn'],
    });
    await auditoriaService.registrar({
      id_usuario: u.id_usuario, accion: 'LOGIN', tabla: 'usuarios', registro_id: u.id_usuario, ip,
    });
    return {
      token,
      usuario: {
        id_usuario: u.id_usuario, nombres: u.nombres, apellidos: u.apellidos, correo: u.correo, rol: u.rol,
      },
    };
  },

  // El token es sin estado: el cliente debe descartarlo. Aquí solo queda el registro de auditoría.
  async logout(actor: AuthUser, ip?: string) {
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'LOGOUT', tabla: 'usuarios', registro_id: actor.id, ip,
    });
    return { mensaje: 'Sesión cerrada' };
  },

  async perfil(actor: AuthUser) {
    const u = await usuarioRepository.buscarPorId(actor.id);
    if (!u) throw new NotFoundError('Usuario no encontrado');
    return u;
  },

  async actualizarPerfil(actor: AuthUser, dto: ActualizarPerfilDto, ip?: string) {
    const antes = await this.perfil(actor);
    try {
      await usuarioRepository.actualizar(actor.id, dto);
    } catch (e) {
      throw duplicadoComo(e, 'Ese correo ya pertenece a otro usuario');
    }
    const despues = await this.perfil(actor);
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'UPDATE', tabla: 'usuarios', registro_id: actor.id,
      anteriores: antes, nuevos: despues, ip,
    });
    return { mensaje: 'Perfil actualizado', perfil: despues };
  },

  async cambiarPassword(actor: AuthUser, dto: CambiarPasswordDto, ip?: string) {
    const fila = await usuarioRepository.obtenerHash(actor.id);
    if (!fila || !(await bcrypt.compare(dto.actual, fila.password_hash))) {
      throw new UnauthorizedError('La contraseña actual es incorrecta');
    }
    await usuarioRepository.actualizarPassword(actor.id, await bcrypt.hash(dto.nueva, 10));
    // Se registra el hecho del cambio, nunca el valor
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'CAMBIO_PASSWORD', tabla: 'usuarios', registro_id: actor.id,
      nuevos: { cambio: true }, ip,
    });
    return { mensaje: 'Contraseña actualizada' };
  },
};
