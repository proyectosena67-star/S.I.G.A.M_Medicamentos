import { ROLES } from "../config/constantes";
import { UsuarioAutenticado } from "../models/auth.model";
import { AsignarEnfermeroDto, FiltrosAplicacionDto, RegistrarAplicacionDto } from "../dtos/aplicacion.dto";
import { CrearImagenDto } from "../dtos/aplicacion-imagen.dto";
import { ErrorConflicto, ErrorNoEncontrado, ErrorProhibido, ErrorSolicitudInvalida } from "../errors/errores-http";
import { aplicacionImagenRepository } from "../repositories/aplicacion-imagen.repository";
import { aplicacionRepository } from "../repositories/aplicacion.repository";
import { usuarioRepository } from "../repositories/usuario.repository";

export const aplicacionService = {
  /** Un Enfermero solo ve sus aplicaciones; los demás roles ven todas. */
  listar(filtros: FiltrosAplicacionDto, solicitante: UsuarioAutenticado) {
    const filtrosFinales =
      solicitante.rol === ROLES.ENFERMERO ? { ...filtros, id_enfermero: solicitante.id_usuario } : filtros;
    return aplicacionRepository.listarConFiltros(filtrosFinales);
  },

  async obtener(id: number) {
    const aplicacion = await aplicacionRepository.buscarConDetalle(id);
    if (!aplicacion) throw new ErrorNoEncontrado("Aplicación no encontrada");
    const imagenes = await aplicacionImagenRepository.listarPorAplicacion(id);
    return { ...aplicacion, imagenes };
  },

  async asignarEnfermero(id: number, datos: AsignarEnfermeroDto) {
    const aplicacion = await aplicacionRepository.buscarPorId(id);
    if (!aplicacion) throw new ErrorNoEncontrado("Aplicación no encontrada");
    if (aplicacion.estado !== "pendiente") {
      throw new ErrorConflicto("Solo se puede asignar enfermero a aplicaciones programadas");
    }

    const enfermero = await usuarioRepository.buscarPorId(datos.id_enfermero);
    if (!enfermero || (enfermero.rol !== ROLES.ENFERMERO && enfermero.rol !== ROLES.ENFERMERO_JEFE)) {
      throw new ErrorSolicitudInvalida("El usuario indicado no es parte del personal de enfermería");
    }
    if (!enfermero.estado) throw new ErrorSolicitudInvalida("El enfermero indicado está inactivo");

    await aplicacionRepository.actualizar(id, { id_enfermero: datos.id_enfermero });
    return this.obtener(id);
  },

  async registrar(id: number, datos: RegistrarAplicacionDto, enfermero: UsuarioAutenticado) {
    const aplicacion = await aplicacionRepository.buscarPorId(id);
    if (!aplicacion) throw new ErrorNoEncontrado("Aplicación no encontrada");
    if (aplicacion.estado !== "pendiente") {
      throw new ErrorConflicto(`Esta aplicación ya fue registrada como ${aplicacion.estado}`);
    }
    if (aplicacion.id_enfermero && aplicacion.id_enfermero !== enfermero.id_usuario) {
      throw new ErrorProhibido("Esta aplicación está asignada a otro enfermero");
    }

    await aplicacionRepository.actualizar(id, {
      id_enfermero: enfermero.id_usuario,
      estado: datos.estado,
      observacion: datos.observacion,
      fecha_hora_aplicacion: new Date(),
    });
    return this.obtener(id);
  },

  async agregarImagen(idAplicacion: number, datos: CrearImagenDto) {
    if (!(await aplicacionRepository.buscarPorId(idAplicacion))) throw new ErrorNoEncontrado("Aplicación no encontrada");
    return aplicacionImagenRepository.crear({ id_aplicacion: idAplicacion, url: datos.url });
  },
};
