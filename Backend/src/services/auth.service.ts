import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { CambiarPasswordDto, LoginDto } from "../dtos/auth.dto";
import { ErrorNoAutenticado, ErrorNoEncontrado, ErrorProhibido, ErrorSolicitudInvalida } from "../errors/errores-http";
import { PayloadToken } from "../models/auth.model";
import { usuarioRepository } from "../repositories/usuario.repository";
import { compararPassword, hashearPassword } from "../utils/contrasenas";
import { auditoriaService } from "./auditoria.service";

export const authService = {
  async iniciarSesion(datos: LoginDto, direccionIp: string) {
    const usuario = await usuarioRepository.buscarPorCorreoConPassword(datos.correo);

    // Mismo mensaje si el correo no existe o la contraseña falla: no se revela cuál de los dos fue.
    const passwordValida = usuario ? await compararPassword(datos.password, usuario.password_hash) : false;
    if (!usuario || !passwordValida) throw new ErrorNoAutenticado("Credenciales incorrectas");
    if (!usuario.estado) throw new ErrorProhibido("La cuenta está inactiva. Contacta al administrador");

    const payload: PayloadToken = { id_usuario: usuario.id_usuario };
    const token = jwt.sign(payload, env.jwt.secreto, { expiresIn: env.jwt.expiracion } as SignOptions);

    await auditoriaService.registrar({
      id_usuario: usuario.id_usuario,
      accion: "LOGIN",
      tabla_afectada: "usuarios",
      registro_id: usuario.id_usuario,
      direccion_ip: direccionIp,
    });

    const { password_hash: _omitido, ...usuarioPublico } = usuario;
    return { token, usuario: usuarioPublico };
  },

  async obtenerPerfil(idUsuario: number) {
    const usuario = await usuarioRepository.buscarPorId(idUsuario);
    if (!usuario) throw new ErrorNoEncontrado("Usuario no encontrado");
    return usuario;
  },

  async cambiarPassword(idUsuario: number, datos: CambiarPasswordDto): Promise<void> {
    const hashActual = await usuarioRepository.buscarPasswordHash(idUsuario);
    if (!hashActual || !(await compararPassword(datos.password_actual, hashActual))) {
      throw new ErrorSolicitudInvalida("La contraseña actual es incorrecta");
    }
    if (datos.password_actual === datos.password_nueva) {
      throw new ErrorSolicitudInvalida("La contraseña nueva debe ser diferente a la actual");
    }
    await usuarioRepository.actualizarPassword(idUsuario, await hashearPassword(datos.password_nueva));
  },
};
