import { withTransaction } from '../config/db';
import { detalleOrdenRepository } from '../data/detalleOrden.repository';
import { dispensacionRepository } from '../data/dispensacion.repository';
import { loteRepository } from '../data/lote.repository';
import { CrearDispensacionDto, FiltrosDispensacionDto } from '../dtos/dispensacion.dto';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const dispensacionService = {
  pendientes: () => dispensacionRepository.pendientes(),
  listar: (f: FiltrosDispensacionDto) => dispensacionRepository.listar(f),

  // Todo en una transacción: o se guarda la dispensación y se descuenta el stock, o no pasa nada
  dispensar(farmaceuta: AuthUser, dto: CrearDispensacionDto, ip?: string) {
    return withTransaction(async (c) => {
      const linea = await detalleOrdenRepository.bloquearParaDispensar(dto.id_detalle_orden, c);
      if (!linea) throw new NotFoundError('La línea de la orden no existe');
      if (linea.estado_orden !== 'Activa') throw new ConflictError('La orden no está activa');

      const lote = await loteRepository.bloquearPorId(dto.id_lote, c);
      if (!lote) throw new NotFoundError('El lote no existe');
      if (lote.id_medicamento !== linea.id_medicamento) {
        throw new ConflictError('El lote no corresponde al medicamento de la orden');
      }
      if (lote.vencido) throw new ConflictError('El lote está vencido y no se puede dispensar');
      if (lote.stock_actual < dto.cantidad_entregada) {
        throw new ConflictError(`Stock insuficiente en el lote (disponible: ${lote.stock_actual})`);
      }

      const yaDispensado = await dispensacionRepository.sumaDispensada(dto.id_detalle_orden, c);
      if (yaDispensado + dto.cantidad_entregada > linea.cantidad) {
        throw new ConflictError(
          `Excede la cantidad prescrita (prescrita: ${linea.cantidad}, ya dispensada: ${yaDispensado})`
        );
      }
      if (linea.es_controlado && dto.confirmar_controlado !== true) {
        throw new BadRequestError('Medicamento controlado: se requiere confirmación adicional', {
          requiere_confirmacion: true,
        });
      }

      await loteRepository.descontarStock(dto.id_lote, dto.cantidad_entregada, c);
      const disp = await dispensacionRepository.crear(
        {
          id_detalle_orden: dto.id_detalle_orden,
          id_lote: dto.id_lote,
          id_farmaceuta: farmaceuta.id,
          cantidad_entregada: dto.cantidad_entregada,
        },
        c
      );
      await auditoriaService.registrar(
        { id_usuario: farmaceuta.id, accion: 'DISPENSAR', tabla: 'dispensaciones',
          registro_id: disp.id_dispensacion, nuevos: { ...disp, medicamento_controlado: linea.es_controlado }, ip },
        c
      );
      return disp;
    });
  },
};
