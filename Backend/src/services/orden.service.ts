import { PoolClient } from 'pg';
import { withTransaction } from '../config/db';
import { detalleOrdenRepository } from '../data/detalleOrden.repository';
import { medicamentoRepository } from '../data/medicamento.repository';
import { ordenRepository } from '../data/orden.repository';
import { pacienteRepository } from '../data/paciente.repository';
import { ItemOrdenDto } from '../dtos/detalleOrden.dto';
import { CrearOrdenDto, EditarOrdenDto, EstadoOrdenDto, FiltrosOrdenDto } from '../dtos/orden.dto';
import { ConflictError, NotFoundError } from '../errors';
import { DetalleOrden } from '../models';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

async function insertarItems(c: PoolClient, idOrden: number, items: ItemOrdenDto[]): Promise<DetalleOrden[]> {
  const creados: DetalleOrden[] = [];
  for (const it of items) {
    const m = await medicamentoRepository.buscarBasico(it.id_medicamento, c);
    if (!m) throw new NotFoundError(`El medicamento ${it.id_medicamento} no existe`);
    if (!m.estado) throw new ConflictError(`El medicamento ${it.id_medicamento} está inactivo`);
    creados.push(await detalleOrdenRepository.crear(idOrden, it, c));
  }
  return creados;
}

export const ordenService = {
  listar: (f: FiltrosOrdenDto) => ordenRepository.listar(f),

  async obtener(id: number) {
    const orden = await ordenRepository.buscarPorId(id);
    if (!orden) throw new NotFoundError('Orden no encontrada');
    return { ...orden, items: await detalleOrdenRepository.listarPorOrden(id) };
  },

  crear(medico: AuthUser, dto: CrearOrdenDto, ip?: string) {
    return withTransaction(async (c) => {
      const paciente = await pacienteRepository.buscarPorId(dto.id_paciente, c);
      if (!paciente) throw new NotFoundError('El paciente no existe');
      if (!paciente.estado) throw new ConflictError('El paciente está inactivo: no se pueden crear órdenes');

      const orden = await ordenRepository.crear(medico.id, dto, c);
      const items = await insertarItems(c, orden.id_orden, dto.items);
      await auditoriaService.registrar(
        { id_usuario: medico.id, accion: 'CREATE', tabla: 'orden_medica', registro_id: orden.id_orden,
          nuevos: { ...orden, items }, ip },
        c
      );
      return { ...orden, items };
    });
  },

  // Modificar una orden activa exige justificación; queda en auditoría con datos anteriores y nuevos
  editar(medico: AuthUser, id: number, dto: EditarOrdenDto, ip?: string) {
    return withTransaction(async (c) => {
      const orden = await ordenRepository.bloquearPorId(id, c);
      if (!orden) throw new NotFoundError('Orden no encontrada');
      if (orden.estado !== 'Activa') throw new ConflictError('Solo se pueden modificar órdenes activas');

      const antes = { ...orden, items: await detalleOrdenRepository.listarPorOrden(id, c) };

      if (dto.items) {
        if (await detalleOrdenRepository.tieneMovimientos(id, c)) {
          throw new ConflictError('No se pueden cambiar los medicamentos: ya hay dispensaciones o aplicaciones');
        }
        await detalleOrdenRepository.eliminarPorOrden(id, c);
        await insertarItems(c, id, dto.items);
      }
      if (dto.tipo_orden !== undefined || dto.detalles !== undefined) {
        await ordenRepository.actualizar(id, { tipo_orden: dto.tipo_orden, detalles: dto.detalles }, c);
      }

      const fila = (await ordenRepository.bloquearPorId(id, c))!;
      const despues = { ...fila, items: await detalleOrdenRepository.listarPorOrden(id, c) };
      await auditoriaService.registrar(
        { id_usuario: medico.id, accion: 'UPDATE', tabla: 'orden_medica', registro_id: id,
          anteriores: antes, nuevos: { ...despues, justificacion: dto.justificacion }, ip },
        c
      );
      return despues;
    });
  },

  cambiarEstado(medico: AuthUser, id: number, dto: EstadoOrdenDto, ip?: string) {
    return withTransaction(async (c) => {
      const orden = await ordenRepository.bloquearPorId(id, c);
      if (!orden) throw new NotFoundError('Orden no encontrada');
      if (orden.estado !== 'Activa') throw new ConflictError('La orden ya no está activa');

      const nueva = await ordenRepository.cambiarEstado(id, dto.estado, c);
      await auditoriaService.registrar(
        { id_usuario: medico.id, accion: dto.estado === 'Cancelada' ? 'CANCELAR' : 'FINALIZAR',
          tabla: 'orden_medica', registro_id: id,
          anteriores: { estado: orden.estado }, nuevos: { estado: nueva.estado, justificacion: dto.justificacion }, ip },
        c
      );
      return nueva;
    });
  },
};
