import { medicamentoRepository } from '../data/medicamento.repository';
import {
  ActualizarMedicamentoDto, CrearMedicamentoDto, FiltrosMedicamentoDto,
} from '../dtos/medicamento.dto';
import { duplicadoComo, NotFoundError } from '../errors';
import { AuthUser } from '../types/auth';
import { auditoriaService } from './auditoria.service';

export const medicamentoService = {
  listar: (f: FiltrosMedicamentoDto) => medicamentoRepository.listar(f),

  async obtener(id: number) {
    const m = await medicamentoRepository.buscarPorId(id);
    if (!m) throw new NotFoundError('Medicamento no encontrado');
    return m;
  },

  async crear(actor: AuthUser, dto: CrearMedicamentoDto, ip?: string) {
    let m;
    try {
      m = await medicamentoRepository.crear(dto);
    } catch (e) {
      throw duplicadoComo(e, 'El código CUMS ya existe: no es posible duplicarlo');
    }
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'CREATE', tabla: 'medicamentos', registro_id: m.id_medicamento,
      nuevos: m, ip,
    });
    return m;
  },

  async actualizar(actor: AuthUser, id: number, dto: ActualizarMedicamentoDto, ip?: string) {
    const antes = await this.obtener(id);
    let despues;
    try {
      despues = await medicamentoRepository.actualizar(id, dto);
    } catch (e) {
      throw duplicadoComo(e, 'El código CUMS ya existe en otro medicamento');
    }
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: 'UPDATE', tabla: 'medicamentos', registro_id: id,
      anteriores: antes, nuevos: despues, ip,
    });
    return despues;
  },

  async cambiarEstado(actor: AuthUser, id: number, estado: boolean, ip?: string) {
    await this.obtener(id);
    const m = await medicamentoRepository.cambiarEstado(id, estado);
    await auditoriaService.registrar({
      id_usuario: actor.id, accion: estado ? 'ACTIVAR' : 'DESACTIVAR', tabla: 'medicamentos', registro_id: id,
      nuevos: { estado }, ip,
    });
    return m;
  },
};
