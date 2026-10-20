import { filtrosAuditoriaDto } from '../dtos/auditoria.dto';
import { validar } from '../dtos/validar';
import { auditoriaService } from '../services/auditoria.service';
import { asyncHandler } from '../utils/http';

export const auditoriaController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await auditoriaService.listar(validar(filtrosAuditoriaDto, req.query)));
  }),
};
