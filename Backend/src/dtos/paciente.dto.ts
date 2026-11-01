import { z } from "zod";
import { GENEROS } from "../config/constantes";
import { correo, documento, exigirAlgunCampo, fechaISO, MENSAJE_SIN_CAMPOS, telefono, texto, tipoDocumento } from "./comun.dto";

export const esquemaCrearPaciente = z.object({
  tipo_documento: tipoDocumento,
  documento,
  nombres: texto(2, 80),
  apellidos: texto(2, 80),
  fecha_nacimiento: fechaISO.refine((f) => new Date(f) <= new Date(), "La fecha de nacimiento no puede ser futura"),
  genero: z.enum(GENEROS, { errorMap: () => ({ message: `Género inválido. Usa: ${GENEROS.join(", ")}` }) }),
  telefono: telefono.optional(),
  correo: correo.optional(),
  direccion: texto(3, 200).optional(),
});
export type CrearPacienteDto = z.infer<typeof esquemaCrearPaciente>;

export const esquemaActualizarPaciente = z
  .object({
    tipo_documento: tipoDocumento,
    documento,
    nombres: texto(2, 80),
    apellidos: texto(2, 80),
    fecha_nacimiento: fechaISO,
    genero: z.enum(GENEROS),
    telefono,
    correo,
    direccion: texto(3, 200),
  })
  .partial()
  .refine(exigirAlgunCampo, MENSAJE_SIN_CAMPOS);
export type ActualizarPacienteDto = z.infer<typeof esquemaActualizarPaciente>;
