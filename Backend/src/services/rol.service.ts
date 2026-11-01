import { ErrorNoEncontrado } from "../errors/errores-http";
import { rolRepository } from "../repositories/rol.repository";

export const rolService = {
  listar() {
    return rolRepository.listar();
  },

  async obtener(id: number) {
    const rol = await rolRepository.buscarPorId(id);
    if (!rol) throw new ErrorNoEncontrado("Rol no encontrado");
    return rol;
  },
};
