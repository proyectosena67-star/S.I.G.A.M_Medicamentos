import { ActualizarPacienteDto, CrearPacienteDto } from "../dtos/paciente.dto";
import { ErrorNoEncontrado } from "../errors/errores-http";
import { pacienteRepository } from "../repositories/paciente.repository";

export const pacienteService = {
  listar() {
    return pacienteRepository.listar();
  },

  async obtener(id: number) {
    const paciente = await pacienteRepository.buscarPorId(id);
    if (!paciente) throw new ErrorNoEncontrado("Paciente no encontrado");
    return paciente;
  },

  crear(datos: CrearPacienteDto) {
    return pacienteRepository.crear(datos);
  },

  async actualizar(id: number, datos: ActualizarPacienteDto) {
    const actualizado = await pacienteRepository.actualizar(id, datos);
    if (!actualizado) throw new ErrorNoEncontrado("Paciente no encontrado");
    return actualizado;
  },

  async cambiarEstado(id: number, estado: boolean) {
    const actualizado = await pacienteRepository.actualizar(id, { estado });
    if (!actualizado) throw new ErrorNoEncontrado("Paciente no encontrado");
    return actualizado;
  },
};
