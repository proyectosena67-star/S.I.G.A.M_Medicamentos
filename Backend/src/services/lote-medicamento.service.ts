import { ActualizarLoteDto, CrearLoteDto } from "../dtos/lote-medicamento.dto";
import { ErrorNoEncontrado, ErrorSolicitudInvalida } from "../errors/errores-http";
import { loteMedicamentoRepository } from "../repositories/lote-medicamento.repository";
import { medicamentoRepository } from "../repositories/medicamento.repository";
import { viaAdministracionRepository } from "../repositories/via-administracion.repository";

async function validarReferencias(idMedicamento?: number, idVia?: number): Promise<void> {
  if (idMedicamento !== undefined && !(await medicamentoRepository.buscarPorId(idMedicamento))) {
    throw new ErrorSolicitudInvalida("El medicamento indicado no existe");
  }
  if (idVia !== undefined && !(await viaAdministracionRepository.buscarPorId(idVia))) {
    throw new ErrorSolicitudInvalida("La vía de administración indicada no existe");
  }
}

export const loteMedicamentoService = {
  listar() {
    return loteMedicamentoRepository.listarConMedicamento();
  },

  async obtener(id: number) {
    const lote = await loteMedicamentoRepository.buscarPorId(id);
    if (!lote) throw new ErrorNoEncontrado("Lote no encontrado");
    return lote;
  },

  async crear(datos: CrearLoteDto) {
    await validarReferencias(datos.id_medicamento, datos.id_via);
    return loteMedicamentoRepository.crear(datos);
  },

  async actualizar(id: number, datos: ActualizarLoteDto) {
    await validarReferencias(datos.id_medicamento, datos.id_via);
    const actualizado = await loteMedicamentoRepository.actualizar(id, datos);
    if (!actualizado) throw new ErrorNoEncontrado("Lote no encontrado");
    return actualizado;
  },
};
