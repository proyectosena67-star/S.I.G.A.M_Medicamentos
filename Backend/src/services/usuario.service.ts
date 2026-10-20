import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { rolRepository } from '../data/rol.repository';
import { usuarioRepository } from '../data/usuario.repository';
import { ActualizarUsuarioDto, CrearUsuarioDto, FiltrosUsuarioDto } from '../dtos/usuario.dto';
import { ConflictError, duplicadoComo, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

const claveTemporal = () => crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, 'x');

async function validarRol(idRol: number) {
  const rol = await rolRepository.buscarPorId(idRol);
  if (!rol) throw new NotFoundError('El rol no existe');
  if (!rol.estado) throw new ConflictError('El rol está inactivo');
}

export const usuarioService = {
  listar: (f: FiltrosUsuarioDto) => usuarioRepository.listar(f),

  async obtener(id: number) {
    const u = await usuarioRepository.buscarPorId(id);
    if (!u) throw new NotFoundError('Usuario no encontrado');
    return u;
  },

  async crear(admin: AuthUser, dto: CrearUsuarioDto, ip?: string) {
    await validarRol(dto.id_rol);
    const temporal = claveTemporal();
    let creado;
    try {
      creado = await usuarioRepository.crear({ ...dto, password_hash: await bcrypt.hash(temporal, 10) });
    } catch (e) {
      throw duplicadoComo(e, 'El documento o el correo ya existen: no es posible duplicar la cuenta');
    }
    const usuario = await this.obtener(creado.id_usuario);
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: 'CREATE', tabla: 'usuarios', registro_id: creado.id_usuario,
      nuevos: usuario, ip,
    });
    // La contraseña temporal se muestra una sola vez; no se guarda en claro en ningún lado
    return { usuario, credenciales: { correo: creado.correo, password_temporal: temporal } };
  },

  async actualizar(admin: AuthUser, id: number, dto: ActualizarUsuarioDto, ip?: string) {
    const antes = await this.obtener(id);
    if (dto.id_rol !== undefined) await validarRol(dto.id_rol);
    try {
      await usuarioRepository.actualizar(id, dto);
    } catch (e) {
      throw duplicadoComo(e, 'El documento o el correo ya pertenecen a otro usuario');
    }
    const despues = await this.obtener(id);
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: 'UPDATE', tabla: 'usuarios', registro_id: id,
      anteriores: antes, nuevos: despues, ip,
    });
    return despues;
  },

  async cambiarEstado(admin: AuthUser, id: number, estado: boolean, ip?: string) {
    if (id === admin.id && !estado) throw new ConflictError('No puedes desactivar tu propia cuenta');
    const antes = await this.obtener(id);
    await usuarioRepository.cambiarEstado(id, estado);
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: estado ? 'ACTIVAR' : 'DESACTIVAR', tabla: 'usuarios', registro_id: id,
      anteriores: { estado: antes.estado }, nuevos: { estado }, ip,
    });
    return this.obtener(id);
  },

  // Mientras la recuperación por correo sea fase futura, el administrador restablece la clave
  async restablecerPassword(admin: AuthUser, id: number, ip?: string) {
    const u = await this.obtener(id);
    const temporal = claveTemporal();
    await usuarioRepository.actualizarPassword(id, await bcrypt.hash(temporal, 10));
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: 'RESET_PASSWORD', tabla: 'usuarios', registro_id: id,
      nuevos: { cambio: true }, ip,
    });
    return { correo: u.correo, password_temporal: temporal };
  },
};
