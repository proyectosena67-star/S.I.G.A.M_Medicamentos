import { envolver } from "../middlewares/envolver-async";
import { usuarioService } from "../services/usuario.service";
import { leerId, responder } from "../utils/respuestas";

export const usuarioController = {
  listar: envolver(async (_req, res) => {
    responder(res, await usuarioService.listar());
  }),

  listarEnfermeros: envolver(async (_req, res) => {
    responder(res, await usuarioService.listarEnfermeros());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await usuarioService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const { usuario, passwordTemporal } = await usuarioService.crear(req.body);
    res.locals.registroId = usuario?.id_usuario;
    res.status(201).json({
      ok: true,
      mensaje: "Usuario creado. Entrega la contraseña temporal de forma segura",
      data: { ...usuario, passwordTemporal },
    });
  }),

  actualizar: envolver(async (req, res) => {
    const usuario = await usuarioService.actualizar(leerId(req), req.body);
    res.locals.registroId = usuario.id_usuario;
    responder(res, usuario);
  }),

  cambiarEstado: envolver(async (req, res) => {
    const usuario = await usuarioService.cambiarEstado(leerId(req), req.body.estado, req.usuario!.id_usuario);
    res.locals.registroId = usuario.id_usuario;
    responder(res, usuario, 200, usuario.estado ? "Usuario activado" : "Usuario desactivado");
  }),
};
