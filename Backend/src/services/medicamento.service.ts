import { ActualizarMedicamentoDto, CrearMedicamentoDto } from "../dtos/medicamento.dto";
import { ErrorNoEncontrado } from "../errors/errores-http";
import { medicamentoRepository } from "../repositories/medicamento.repository";

export const medicamentoService = {
  listar() {
    return medicamentoRepository.listar();
  },

  async obtener(id: number) {
    const medicamento = await medicamentoRepository.buscarPorId(id);
    if (!medicamento) throw new ErrorNoEncontrado("Medicamento no encontrado");
    return medicamento;
  },

  crear(datos: CrearMedicamentoDto) {
    return medicamentoRepository.crear(datos);
  },

  async actualizar(id: number, datos: ActualizarMedicamentoDto) {
    const actualizado = await medicamentoRepository.actualizar(id, datos);
    if (!actualizado) throw new ErrorNoEncontrado("Medicamento no encontrado");
    return actualizado;
  },

  async cambiarEstado(id: number, estado: boolean) {
    const actualizado = await medicamentoRepository.actualizar(id, { estado });
    if (!actualizado) throw new ErrorNoEncontrado("Medicamento no encontrado");
    return actualizado;
  },
};
