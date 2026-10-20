import { Rol } from '../models';
import { CrearRolDto, ActualizarRolDto } from '../dtos/rol.dto';
import { actualizarPorId, pool, Queryable, todas, una, unaObligatoria } from './base';

export const rolRepository = {
  listar: (db: Queryable = pool) => todas<Rol>(db, 'SELECT * FROM roles ORDER BY nombre'),

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<Rol>(db, 'SELECT * FROM roles WHERE id_rol = $1', [id]),

  crear: (d: CrearRolDto, db: Queryable = pool) =>
    unaObligatoria<Rol>(db, 'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *', [
      d.nombre,
      d.descripcion ?? null,
    ]),

  actualizar: (id: number, d: ActualizarRolDto, db: Queryable = pool) =>
    actualizarPorId<Rol>(db, 'roles', 'id_rol', id, d, ['nombre', 'descripcion']),

  cambiarEstado: (id: number, estado: boolean, db: Queryable = pool) =>
    una<Rol>(db, 'UPDATE roles SET estado = $1 WHERE id_rol = $2 RETURNING *', [estado, id]),
};
