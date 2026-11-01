import { ActualizarViaDto, CrearViaDto } from "../dtos/via-administracion.dto";
import { ErrorNoEncontrado } from "../errors/errores-http";
import { viaAdministracionRepository } from "../repositories/via-administracion.repository";

export const viaAdministracionService = {
  listar() {
    return viaAdministracionRepository.listar();
  },

  async obtener(id: number) {
    const via = await viaAdministracionRepository.buscarPorId(id);
    if (!via) throw new ErrorNoEncontrado("Vía de administración no encontrada");
    return via;
  },

  crear(datos: CrearViaDto) {
    return viaAdministracionRepository.crear(datos);
  },

  async actualizar(id: number, datos: ActualizarViaDto) {
    const actualizada = await viaAdministracionRepository.actualizar(id, datos);
    if (!actualizada) throw new ErrorNoEncontrado("Vía de administración no encontrada");
    return actualizada;
  },

  async cambiarEstado(id: number, estado: boolean) {
    const actualizada = await viaAdministracionRepository.actualizar(id, { estado });
    if (!actualizada) throw new ErrorNoEncontrado("Vía de administración no encontrada");
    return actualizada;
  },
};
