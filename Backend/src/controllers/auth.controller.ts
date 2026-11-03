import { envolver } from "../middlewares/envolver-async";
import { authService } from "../services/auth.service";
import { auditoriaService } from "../services/auditoria.service";
import { obtenerIp, responder } from "../utils/respuestas";

export const authController = {
  iniciarSesion: envolver(async (req, res) => {
    const resultado = await authService.iniciarSesion(req.body, obtenerIp(req));
    responder(res, resultado, 200, "Inicio de sesión exitoso");
  }),

  perfil: envolver(async (req, res) => {
    responder(res, await authService.obtenerPerfil(req.usuario!.id_usuario));
  }),

  cambiarPassword: envolver(async (req, res) => {
    await authService.cambiarPassword(req.usuario!.id_usuario, req.body);
    await auditoriaService.registrar({
      id_usuario: req.usuario!.id_usuario,
      accion: "CAMBIAR_PASSWORD",
      tabla_afectada: "usuarios",
      registro_id: req.usuario!.id_usuario,
      direccion_ip: obtenerIp(req),
    });
    responder(res, null, 200, "Contraseña actualizada correctamente");
  }),
};
