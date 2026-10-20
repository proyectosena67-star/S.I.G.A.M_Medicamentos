import { pacienteRepository } from '../data/paciente.repository';
import { ActualizarPacienteDto, CrearPacienteDto, FiltrosPacienteDto } from '../dtos/paciente.dto';
import { duplicadoComo, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const pacienteService = {
  listar: (f: FiltrosPacienteDto) => pacienteRepository.listar(f),

  async obtener(id: number) {
    const p = await pacienteRepository.buscarPorId(id);
    if (!p) throw new NotFoundError('Paciente no encontrado');
    return p;
  },

  async crear(actor: AuthUser, dto: CrearPacienteDto, ip?: string) {
    let paciente;
    try {
      paciente = await pacienteRepository.crear(dto);
    } catch (e) {
      throw duplicadoComo(e, 'El paciente ya está registrado');
    }
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'CREATE', tabla: 'pacientes', registro_id: paciente.id_paciente,
      nuevos: paciente, ip,
    });
    return { mensaje: 'Registro exitoso', paciente };
  },

  async actualizar(actor: AuthUser, id: number, dto: ActualizarPacienteDto, ip?: string) {
    const antes = await this.obtener(id);
    let despues;
    try {
      despues = await pacienteRepository.actualizar(id, dto);
    } catch (e) {
      throw duplicadoComo(e, 'Ya existe otro paciente con ese documento');
    }
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'UPDATE', tabla: 'pacientes', registro_id: id,
      anteriores: antes, nuevos: despues, ip,
    });
    return despues;
  },

  async cambiarEstado(actor: AuthUser, id: number, estado: boolean, ip?: string) {
    const antes = await this.obtener(id);
    const despues = await pacienteRepository.cambiarEstado(id, estado);
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: estado ? 'ACTIVAR' : 'DESACTIVAR', tabla: 'pacientes', registro_id: id,
      anteriores: { estado: antes.estado }, nuevos: { estado }, ip,
    });
    return despues;
  },
};
