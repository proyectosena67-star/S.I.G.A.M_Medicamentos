import { rolRepository } from '../data/rol.repository';
import { ActualizarRolDto, CrearRolDto } from '../dtos/rol.dto';
import { duplicadoComo, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const rolService = {
  listar: () => rolRepository.listar(),

  async crear(admin: AuthUser, dto: CrearRolDto, ip?: string) {
    let rol;
    try {
      rol = await rolRepository.crear(dto);
    } catch (e) {
      throw duplicadoComo(e, 'Ya existe un rol con ese nombre');
    }
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: 'CREATE', tabla: 'roles', registro_id: rol.id_rol, nuevos: rol, ip,
    });
    return rol;
  },

  async actualizar(admin: AuthUser, id: number, dto: ActualizarRolDto, ip?: string) {
    const antes = await rolRepository.buscarPorId(id);
    if (!antes) throw new NotFoundError('Rol no encontrado');
    let rol;
    try {
      rol = await rolRepository.actualizar(id, dto);
    } catch (e) {
      throw duplicadoComo(e, 'Ya existe un rol con ese nombre');
    }
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: 'UPDATE', tabla: 'roles', registro_id: id, anteriores: antes, nuevos: rol, ip,
    });
    return rol;
  },

  async cambiarEstado(admin: AuthUser, id: number, estado: boolean, ip?: string) {
    const rol = await rolRepository.cambiarEstado(id, estado);
    if (!rol) throw new NotFoundError('Rol no encontrado');
    await auditoriaService.registrar({
      id_usuario: admin.id, accion: estado ? 'ACTIVAR' : 'DESACTIVAR', tabla: 'roles', registro_id: id,
      nuevos: { estado }, ip,
    });
    return rol;
  },
};
