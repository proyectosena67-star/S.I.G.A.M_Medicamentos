import { CrearOrdenDto, FiltrosOrdenDto, ItemOrdenDto } from "../dtos/orden-medica.dto";
import { EstadoOrden } from "../config/constantes";
import { ejecutarTransaccion } from "../data/base-datos";
import { ErrorConflicto, ErrorNoEncontrado, ErrorSolicitudInvalida } from "../errors/errores-http";
import { aplicacionRepository } from "../repositories/aplicacion.repository";
import { detalleOrdenRepository } from "../repositories/detalle-orden.repository";
import { medicamentoRepository } from "../repositories/medicamento.repository";
import { ordenMedicaRepository } from "../repositories/orden-medica.repository";
import { pacienteRepository } from "../repositories/paciente.repository";
import { viaAdministracionRepository } from "../repositories/via-administracion.repository";

const MS_POR_HORA = 60 * 60 * 1000;

async function validarItem(item: ItemOrdenDto, posicion: number): Promise<void> {
  const etiqueta = `Medicamento #${posicion}`;
  const medicamento = await medicamentoRepository.buscarPorId(item.id_medicamento);
  if (!medicamento) throw new ErrorSolicitudInvalida(`${etiqueta}: el medicamento no existe`);
  if (!medicamento.estado) throw new ErrorSolicitudInvalida(`${etiqueta}: el medicamento está inactivo`);

  const via = await viaAdministracionRepository.buscarPorId(item.id_via);
  if (!via) throw new ErrorSolicitudInvalida(`${etiqueta}: la vía de administración no existe`);
  if (!via.estado) throw new ErrorSolicitudInvalida(`${etiqueta}: la vía de administración está inactiva`);
}

export const ordenMedicaService = {
  listar(filtros: FiltrosOrdenDto) {
    return ordenMedicaRepository.listarConFiltros(filtros);
  },

  async obtener(id: number) {
    const orden = await ordenMedicaRepository.buscarConNombres(id);
    if (!orden) throw new ErrorNoEncontrado("Orden médica no encontrada");
    const medicamentos = await detalleOrdenRepository.listarPorOrden(id);
    return { ...orden, medicamentos };
  },

  /**
   * Crea la orden, sus medicamentos y deja programadas todas las aplicaciones
   * (una cada `frecuencia_horas`, `total_aplicaciones` veces) en una sola transacción.
   */
  async crear(idMedico: number, datos: CrearOrdenDto) {
    const paciente = await pacienteRepository.buscarPorId(datos.id_paciente);
    if (!paciente) throw new ErrorSolicitudInvalida("El paciente indicado no existe");
    if (!paciente.estado) throw new ErrorSolicitudInvalida("El paciente está inactivo");

    for (const [indice, item] of datos.medicamentos.entries()) await validarItem(item, indice + 1);

    const idOrden = await ejecutarTransaccion(async (cx) => {
      const orden = await ordenMedicaRepository.crear(
        { id_usuario: idMedico, id_paciente: datos.id_paciente, detalles: datos.detalles, estado: "activa" },
        cx
      );

      for (const item of datos.medicamentos) {
        const inicio = item.fecha_inicio ?? new Date();
        const detalle = await detalleOrdenRepository.crear({ ...item, fecha_inicio: inicio, id_orden: orden.id_orden }, cx);

        for (let n = 0; n < item.total_aplicaciones; n++) {
          await aplicacionRepository.crear(
            {
              id_detalle_orden: detalle.id_detalle_orden,
              fecha_hora_programada: new Date(inicio.getTime() + n * item.frecuencia_horas * MS_POR_HORA),
              estado: "pendiente",
            },
            cx
          );
        }
      }
      return orden.id_orden;
    });

    return this.obtener(idOrden);
  },

  async cambiarEstado(id: number, estado: EstadoOrden) {
    const orden = await ordenMedicaRepository.buscarPorId(id);
    if (!orden) throw new ErrorNoEncontrado("Orden médica no encontrada");
    if (orden.estado !== "activa") {
      throw new ErrorConflicto(`La orden ya está ${orden.estado.toLowerCase()} y no se puede modificar`);
    }
    if (estado === "activa") throw new ErrorSolicitudInvalida("La orden ya está activa");

    await ejecutarTransaccion(async (cx) => {
      await ordenMedicaRepository.actualizar(id, { estado }, cx);
      if (estado === "cancelada") await aplicacionRepository.cancelarPendientesDeOrden(id, cx);
    });
    return this.obtener(id);
  },
};
