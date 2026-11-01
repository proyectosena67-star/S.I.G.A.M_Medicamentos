import { ROLES } from "../config/constantes";
import { ActualizarUsuarioDto, CrearUsuarioDto } from "../dtos/usuario.dto";
import { ErrorNoEncontrado, ErrorSolicitudInvalida } from "../errors/errores-http";
import { rolRepository } from "../repositories/rol.repository";
import { usuarioRepository } from "../repositories/usuario.repository";
import { generarPasswordTemporal, hashearPassword } from "../utils/contrasenas";

async function exigirRolActivo(idRol: number): Promise<void> {
  const rol = await rolRepository.buscarPorId(idRol);
  if (!rol || !rol.estado) throw new ErrorSolicitudInvalida("El rol indicado no existe o está inactivo");
}

export const usuarioService = {
  listar() {
    return usuarioRepository.listar();
  },

  /** Enfermeros activos, para que el Enfermero Jefe pueda asignarles aplicaciones. */
  listarEnfermeros() {
    return usuarioRepository.listarPorRoles([ROLES.ENFERMERO, ROLES.ENFERMERO_JEFE]);
  },

  async obtener(id: number) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new ErrorNoEncontrado("Usuario no encontrado");
    return usuario;
  },

  async crear(datos: CrearUsuarioDto) {
    await exigirRolActivo(datos.id_rol);

    const passwordTemporal = generarPasswordTemporal();
    const creado = await usuarioRepository.crear({
      ...datos,
      password_hash: await hashearPassword(passwordTemporal),
    });

    const usuario = await usuarioRepository.buscarPorId(creado.id_usuario);
    return { usuario, passwordTemporal };
  },

  async actualizar(id: number, datos: ActualizarUsuarioDto) {
    await this.obtener(id);
    if (datos.id_rol !== undefined) await exigirRolActivo(datos.id_rol);
    await usuarioRepository.actualizar(id, datos);
    return this.obtener(id);
  },

  async cambiarEstado(id: number, estado: boolean, idUsuarioQueActua: number) {
    if (id === idUsuarioQueActua && !estado) {
      throw new ErrorSolicitudInvalida("No puedes desactivar tu propia cuenta");
    }
    await this.obtener(id);
    await usuarioRepository.actualizar(id, { estado });
    return this.obtener(id);
  },
};
