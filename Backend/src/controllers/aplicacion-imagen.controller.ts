import { envolver } from "../middlewares/envolver-async";
import { aplicacionService } from "../services/aplicacion.service";
import { leerId, responder } from "../utils/respuestas";

export const aplicacionImagenController = {
  agregar: envolver(async (req, res) => {
    const imagen = await aplicacionService.agregarImagen(leerId(req), req.body);
    res.locals.registroId = imagen.id_imagen;
    responder(res, imagen, 201, "Imagen agregada a la aplicación");
  }),
};
