import { Paciente } from '../models';
import { ActualizarPacienteDto, CrearPacienteDto, FiltrosPacienteDto } from '../dtos/paciente.dto';
import { actualizarPorId, Condiciones, pool, Queryable, todas, una, unaObligatoria } from './base';

export const pacienteRepository = {
  listar(f: FiltrosPacienteDto, db: Queryable = pool) {
    const c = new Condiciones();
    if (f.q) c.agregar('(documento ILIKE ? OR nombres ILIKE ? OR apellidos ILIKE ?)', `%${f.q}%`);
    if (f.estado !== undefined) c.agregar('estado = ?', f.estado);
    return todas<Paciente>(db, `SELECT * FROM pacientes ${c.where} ORDER BY apellidos, nombres`, c.valores);
  },

  buscarPorId: (id: number, db: Queryable = pool) =>
    una<Paciente>(db, 'SELECT * FROM pacientes WHERE id_paciente = $1', [id]),

  crear: (d: CrearPacienteDto, db: Queryable = pool) =>
    unaObligatoria<Paciente>(
      db,
      `INSERT INTO pacientes (tipo_documento, documento, nombres, apellidos, fecha_nacimiento,
                              genero, telefono, correo, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [d.tipo_documento, d.documento, d.nombres, d.apellidos, d.fecha_nacimiento ?? null,
       d.genero ?? null, d.telefono ?? null, d.correo ?? null, d.direccion ?? null]
    ),

  actualizar: (id: number, d: ActualizarPacienteDto, db: Queryable = pool) =>
    actualizarPorId<Paciente>(db, 'pacientes', 'id_paciente', id, d, [
      'tipo_documento', 'documento', 'nombres', 'apellidos', 'fecha_nacimiento',
      'genero', 'telefono', 'correo', 'direccion',
    ]),

  cambiarEstado: (id: number, estado: boolean, db: Queryable = pool) =>
    una<Paciente>(db, 'UPDATE pacientes SET estado = $1 WHERE id_paciente = $2 RETURNING *', [estado, id]),
};
