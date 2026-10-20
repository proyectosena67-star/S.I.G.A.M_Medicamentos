import { Usuario, UsuarioAuth, UsuarioLogin, UsuarioPublico } from '../models';
import { ActualizarUsuarioDto, CrearUsuarioDto, FiltrosUsuarioDto } from '../dtos/usuario.dto';
import { actualizarPorId, Condiciones, pool, Queryable, todas, una, unaObligatoria } from './base';

const COLS = `u.id_usuario, u.id_rol, r.nombre AS rol, u.tipo_documento, u.documento, u.nombres,
              u.apellidos, u.correo, u.telefono, u.especialidad, u.estado, u.fecha_creacion`;
const FROM = 'FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol';

export const usuarioRepository = {
  listar(f: FiltrosUsuarioDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.q) c.agregar('(u.documento ILIKE ? OR u.nombres ILIKE ? OR u.apellidos ILIKE ? OR u.correo ILIKE ?)', `%${f.q}%`);
    if (f.estado !== undefined) c.agregar('u.estado = ?', f.estado);
    if (f.id_rol !== undefined) c.agregar('u.id_rol = ?', f.id_rol);
    return todas<UsuarioPublico>(
      db,
      `SELECT ${COLS} ${FROM} ${c.where} ORDER BY u.apellidos, u.nombres`,
      c.valores
    );
  },

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<UsuarioPublico>(db, `SELECT ${COLS} ${FROM} WHERE u.id_usuario = $1`, [id]),

  buscarParaLogin: (correo: string, db: Queryable = pool) =>
    una<UsuarioLogin>(
      db,
      `SELECT u.*, r.nombre AS rol, r.estado AS rol_estado ${FROM} WHERE LOWER(u.correo) = LOWER($1)`,
      [correo]
    ),

  buscarAuth: (id: number, db: Queryable = pool) =>
    una<UsuarioAuth>(
      db,
      `SELECT u.id_usuario, u.correo, u.estado, r.nombre AS rol, r.estado AS rol_estado
         ${FROM} WHERE u.id_usuario = $1`,
      [id]
    ),

  obtenerHash: (id: number, db: Queryable = pool) =>
    una<{ password_hash: string }>(db, 'SELECT password_hash FROM usuarios WHERE id_usuario = $1', [id]),

  crear: (d: CrearUsuarioDto & { password_hash: string }, db: Queryable = pool) =>
    unaObligatoria<Usuario>(
      db,
      `INSERT INTO usuarios (id_rol, tipo_documento, documento, nombres, apellidos, correo,
                             password_hash, telefono, especialidad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [d.id_rol, d.tipo_documento, d.documento, d.nombres, d.apellidos, d.correo,
       d.password_hash, d.telefono ?? null, d.especialidad ?? null]
    ),

  actualizar: (id: number, d: ActualizarUsuarioDto, db: Queryable = pool) =>
    actualizarPorId<Usuario>(db, 'usuarios', 'id_usuario', id, d, [
      'id_rol', 'tipo_documento', 'documento', 'nombres', 'apellidos', 'correo', 'telefono', 'especialidad',
    ]),

  cambiarEstado: (id: number, estado: boolean, db: Queryable = pool) =>
    db.query('UPDATE usuarios SET estado = $1 WHERE id_usuario = $2', [estado, id]),

  actualizarPassword: (id: number, hash: string, db: Queryable = pool) =>
    db.query('UPDATE usuarios SET password_hash = $1 WHERE id_usuario = $2', [hash, id]),
};
