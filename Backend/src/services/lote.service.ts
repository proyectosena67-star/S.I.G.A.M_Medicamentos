import { loteRepository } from '../data/lote.repository';
import { medicamentoRepository } from '../data/medicamento.repository';
import { ActualizarLoteDto, CrearLoteDto, FiltrosLoteDto } from '../dtos/lote.dto';
import { NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const loteService = {
  listar: (f: FiltrosLoteDto) => loteRepository.listar(f),

  async crear(actor: AuthUser, dto: CrearLoteDto, ip?: string) {
    if (!(await medicamentoRepository.buscarBasico(dto.id_medicamento))) {
      throw new NotFoundError('El medicamento no existe');
    }
    const lote = await loteRepository.crear(dto);
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'CREATE', tabla: 'lotes_medicamento', registro_id: lote.id_lote,
      nuevos: lote, ip,
    });
    return lote;
  },

  async actualizar(actor: AuthUser, id: number, dto: ActualizarLoteDto, ip?: string) {
    const antes = await loteRepository.buscarPorId(id);
    if (!antes) throw new NotFoundError('Lote no encontrado');
    const despues = await loteRepository.actualizar(id, dto);
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'UPDATE', tabla: 'lotes_medicamento', registro_id: id,
      anteriores: antes, nuevos: despues, ip,
    });
    return despues;
  },

  // Stock bajo (suma de lotes vigentes <= stock_minimo), lotes vencidos con stock y lotes que vencen en 30 días
  async alertas() {
    const [stock_bajo, lotes_vencidos, lotes_por_vencer] = await Promise.all([
      loteRepository.medicamentosConStockBajo(),
      loteRepository.vencidosConStock(),
      loteRepository.porVencer(30),
    ]);
    return { stock_bajo, lotes_vencidos, lotes_por_vencer };
  },
};
