import { z } from "zod";
import { correo, documento, exigirAlgunCampo, idPositivo, MENSAJE_SIN_CAMPOS, telefono, texto, tipoDocumento } from "./comun.dto";

export const esquemaCrearUsuario = z.object({
  id_rol: idPositivo,
  tipo_documento: tipoDocumento,
  documento,
  nombres: texto(2, 80),
  apellidos: texto(2, 80),
  correo,
  telefono: telefono.optional(),
  especialidad: texto(2, 100).optional(),
});
export type CrearUsuarioDto = z.infer<typeof esquemaCrearUsuario>;

export const esquemaActualizarUsuario = esquemaCrearUsuario.partial().refine(exigirAlgunCampo, MENSAJE_SIN_CAMPOS);
export type ActualizarUsuarioDto = z.infer<typeof esquemaActualizarUsuario>;
