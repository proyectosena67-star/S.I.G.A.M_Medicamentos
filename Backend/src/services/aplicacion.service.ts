import { withTransaction } from '../config/db';
import { aplicacionRepository } from '../data/aplicacion.repository';
import { detalleOrdenRepository } from '../data/detalleOrden.repository';
import { CrearAplicacionDto, FiltrosAplicacionDto } from '../dtos/aplicacion.dto';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

const norm = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();

export const aplicacionService = {
  pendientes: () => aplicacionRepository.pendientes(),
  listar: (f: FiltrosAplicacionDto) => aplicacionRepository.listar(f),

  registrar(enfermero: AuthUser, dto: CrearAplicacionDto, ip?: string) {
    return withTransaction(async (c) => {
      const linea = await detalleOrdenRepository.contextoAplicacion(dto.id_detalle_orden, c);
      if (!linea) throw new NotFoundError('La línea de la orden no existe');
      if (linea.estado_orden !== 'Activa') throw new ConflictError('La orden no está activa');
      if (linea.dispensado <= 0) throw new ConflictError('El medicamento aún no ha sido dispensado');

      const via = (dto.via_administracion ?? linea.via_medicamento ?? '').trim();
      const observacion = (dto.observacion ?? '').trim();

      // Alerta si la vía registrada no coincide con la del medicamento: exige justificación
      let alerta: string | null = null;
      if (linea.via_medicamento && via && norm(via) !== norm(linea.via_medicamento)) {
        alerta = `La vía registrada (${via}) es distinta a la del medicamento (${linea.via_medicamento})`;
        if (!observacion) {
          throw new BadRequestError(`${alerta}. Escribe una justificación en la observación.`, { alerta: true });
        }
      }

      const aplicacion = await aplicacionRepository.crear(
        {
          id_detalle_orden: dto.id_detalle_orden,
          id_usuario: enfermero.id,
          fecha_hora_aplicacion: dto.fecha_hora_aplicacion,
          via_administracion: via || null,
          observacion: observacion || null,
        },
        c
      );
      await auditoriaService.registrar(
        { id_usuario: enfermero.id, accion: 'APLICAR', tabla: 'aplicacion',
          registro_id: aplicacion.id_aplicacion, nuevos: { ...aplicacion, alerta }, ip },
        c
      );
      return { aplicacion, alerta };
    });
  },
};
