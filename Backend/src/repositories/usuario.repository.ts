import { Ejecutor, pool } from "../data/base-datos";
import { Usuario, UsuarioConPassword } from "../models/usuario.model";
import { RepositorioBase } from "./repositorio.base";

const SELECT_USUARIO = `
  SELECT u.id_usuario, u.id_rol, r.nombre AS rol, u.tipo_documento, u.documento, u.nombres, u.apellidos,
         u.correo, u.telefono, u.especialidad, u.estado, u.fecha_creacion
  FROM usuarios u
  JOIN roles r ON r.id_rol = u.id_rol`;

// Columnas que devuelve INSERT/UPDATE (sin password_hash).
const COLUMNAS_PUBLICAS =
  "id_usuario, id_rol, tipo_documento, documento, nombres, apellidos, correo, telefono, especialidad, estado, fecha_creacion";

class UsuarioRepository extends RepositorioBase<Usuario> {
  constructor() {
    super(
      "usuarios",
      "id_usuario",
      ["id_rol", "tipo_documento", "documento", "nombres", "apellidos", "correo", "password_hash", "telefono", "especialidad", "estado"],
      COLUMNAS_PUBLICAS
    );
  }

  /** Lista usuarios con el nombre de su rol. */
  override async listar(ejecutor: Ejecutor = pool): Promise<Usuario[]> {
    const resultado = await ejecutor.query(`${SELECT_USUARIO} ORDER BY u.id_usuario`);
    return resultado.rows;
  }

  /** Busca un usuario con el nombre de su rol. */
  override async buscarPorId(id: number, ejecutor: Ejecutor = pool): Promise<Usuario | null> {
    const resultado = await ejecutor.query(`${SELECT_USUARIO} WHERE u.id_usuario = $1`, [id]);
    return resultado.rows[0] ?? null;
  }

  /** Usuarios activos que pertenecen a alguno de los roles indicados. */
  async listarPorRoles(nombresRoles: string[], ejecutor: Ejecutor = pool): Promise<Usuario[]> {
    const resultado = await ejecutor.query(
      `${SELECT_USUARIO} WHERE r.nombre = ANY($1::text[]) AND u.estado = TRUE ORDER BY u.nombres`,
      [nombresRoles]
    );
    return resultado.rows;
  }

  /** Solo para el login: incluye el hash de la contraseña. */
  async buscarPorCorreoConPassword(correo: string, ejecutor: Ejecutor = pool): Promise<UsuarioConPassword | null> {
    const resultado = await ejecutor.query(
      `SELECT u.*, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE u.correo = $1`,
      [correo.toLowerCase()]
    );
    return resultado.rows[0] ?? null;
  }

  async buscarPasswordHash(id: number, ejecutor: Ejecutor = pool): Promise<string | null> {
    const resultado = await ejecutor.query(`SELECT password_hash FROM usuarios WHERE id_usuario = $1`, [id]);
    return resultado.rows[0]?.password_hash ?? null;
  }

  async actualizarPassword(id: number, passwordHash: string, ejecutor: Ejecutor = pool): Promise<void> {
    await ejecutor.query(`UPDATE usuarios SET password_hash = $1 WHERE id_usuario = $2`, [passwordHash, id]);
  }
}

export const usuarioRepository = new UsuarioRepository();
