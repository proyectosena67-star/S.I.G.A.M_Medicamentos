import { detalleOrdenRepository } from '../data/detalleOrden.repository';
import { NotFoundError } from '../errors';

export const detalleOrdenService = {
  listarPorOrden: (idOrden: number) => detalleOrdenRepository.listarPorOrden(idOrden),

  async obtener(id: number) {
    const d = await detalleOrdenRepository.buscarPorId(id);
    if (!d) throw new NotFoundError('Línea de orden no encontrada');
    return d;
  },
};
