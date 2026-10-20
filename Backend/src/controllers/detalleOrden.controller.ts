import { filtrosDetalleOrdenDto } from '../dtos/detalleOrden.dto';
import { validar } from '../dtos/validar';
import { detalleOrdenService } from '../services/detalleOrden.service';
import { asyncHandler, idDe } from '../utils/http';

// Las líneas se crean y modifican a través de la orden (POST/PUT /api/ordenes); aquí solo se consultan
export const detalleOrdenController = {
  listar: asyncHandler(async (req, res) => {
    const { id_orden } = validar(filtrosDetalleOrdenDto, req.query);
    res.json(await detalleOrdenService.listarPorOrden(id_orden));
  }),
  obtener: asyncHandler(async (req, res) => {
    res.json(await detalleOrdenService.obtener(idDe(req)));
  }),
};
