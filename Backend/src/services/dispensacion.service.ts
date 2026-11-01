import { ejecutarTransaccion } from "../data/base-datos";
import { CrearDispensacionDto, FiltrosDispensacionDto } from "../dtos/dispensacion.dto";
import { ErrorConflicto, ErrorNoEncontrado, ErrorSolicitudInvalida } from "../errors/errores-http";
import { detalleOrdenRepository } from "../repositories/detalle-orden.repository";
import { dispensacionRepository } from "../repositories/dispensacion.repository";
import { loteMedicamentoRepository } from "../repositories/lote-medicamento.repository";
import { ordenMedicaRepository } from "../repositories/orden-medica.repository";

export const dispensacionService = {
  listar(filtros: FiltrosDispensacionDto) {
    return dispensacionRepository.listarConFiltros(filtros);
  },

  async obtener(id: number) {
    const dispensacion = await dispensacionRepository.buscarPorId(id);
    if (!dispensacion) throw new ErrorNoEncontrado("Dispensación no encontrada");
    return dispensacion;
  },

  /** Entrega medicamento de un lote para un ítem de orden y descuenta el stock de forma segura. */
  async crear(idFarmaceuta: number, datos: CrearDispensacionDto) {
    const detalle = await detalleOrdenRepository.buscarPorId(datos.id_detalle_orden);
    if (!detalle) throw new ErrorSolicitudInvalida("El ítem de orden indicado no existe");

    const orden = await ordenMedicaRepository.buscarPorId(detalle.id_orden);
    if (orden?.estado !== "activa") throw new ErrorConflicto("Solo se dispensa sobre órdenes activas");

    return ejecutarTransaccion(async (cx) => {
      const lote = await loteMedicamentoRepository.buscarParaActualizar(datos.id_lote, cx);
      if (!lote) throw new ErrorSolicitudInvalida("El lote indicado no existe");
      if (lote.id_medicamento !== detalle.id_medicamento) {
        throw new ErrorSolicitudInvalida("El lote no corresponde al medicamento de la orden");
      }
      if (lote.fecha_vence < new Date().toISOString().slice(0, 10)) {
        throw new ErrorConflicto("El lote está vencido");
      }
      if (lote.stock_actual < datos.cantidad_entregada) {
        throw new ErrorConflicto(`Stock insuficiente en el lote (disponible: ${lote.stock_actual})`);
      }

      await loteMedicamentoRepository.descontarStock(lote.id_lote, datos.cantidad_entregada, cx);
      return dispensacionRepository.crear({ ...datos, id_farmaceuta: idFarmaceuta }, cx);
    });
  },
};
