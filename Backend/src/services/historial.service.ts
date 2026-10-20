import { aplicacionRepository } from '../data/aplicacion.repository';
import { detalleOrdenRepository } from '../data/detalleOrden.repository';
import { dispensacionRepository } from '../data/dispensacion.repository';
import { ordenRepository } from '../data/orden.repository';
import { pacienteRepository } from '../data/paciente.repository';
import { FiltrosHistorialDto } from '../dtos/paciente.dto';
import { NotFoundError } from '../errors';

function agrupar<T>(filas: T[], clave: (f: T) => number): Map<number, T[]> {
  const mapa = new Map<number, T[]>();
  for (const f of filas) {
    const k = clave(f);
    mapa.set(k, [...(mapa.get(k) ?? []), f]);
  }
  return mapa;
}

// Órdenes, dispensaciones y aplicaciones de un paciente, agrupadas por orden y por línea
export const historialService = {
  async delPaciente(idPaciente: number, f: FiltrosHistorialDto) {
    const paciente = await pacienteRepository.buscarPorId(idPaciente);
    if (!paciente) throw new NotFoundError('Paciente no encontrado');

    const ordenes = await ordenRepository.listar({ id_paciente: idPaciente, ...f });
    if (!ordenes.length) return { paciente, ordenes: [] };

    const items = await detalleOrdenRepository.listarPorOrdenes(ordenes.map((o) => o.id_orden));
    const idsItems = items.map((i) => i.id_detalle_orden);
    const disp = agrupar(await dispensacionRepository.listarPorDetalles(idsItems), (d) => d.id_detalle_orden);
    const apl = agrupar(await aplicacionRepository.listarPorDetalles(idsItems), (a) => a.id_detalle_orden);
    const itemsPorOrden = agrupar(
      items.map((i) => ({
        ...i,
        dispensaciones: disp.get(i.id_detalle_orden) ?? [],
        aplicaciones_registradas: apl.get(i.id_detalle_orden) ?? [],
      })),
      (i) => i.id_orden
    );

    return { paciente, ordenes: ordenes.map((o) => ({ ...o, items: itemsPorOrden.get(o.id_orden) ?? [] })) };
  },
};
