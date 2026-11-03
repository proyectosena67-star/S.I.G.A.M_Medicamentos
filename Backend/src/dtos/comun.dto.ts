import { z } from "zod";
import { TIPOS_DOCUMENTO } from "../config/constantes";

export const idPositivo = z.coerce.number({ invalid_type_error: "Debe ser un número" }).int("Debe ser un entero").positive("Debe ser mayor que cero");

export const tipoDocumento = z.enum(TIPOS_DOCUMENTO, {
  errorMap: () => ({ message: `Tipo de documento inválido. Usa: ${TIPOS_DOCUMENTO.join(", ")}` }),
});

export const documento = z.string().trim().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres").regex(/^[A-Za-z0-9]+$/, "Solo letras y números");

export const telefono = z.string().trim().min(7, "Teléfono muy corto").max(20, "Teléfono muy largo");

export const correo = z.string().trim().toLowerCase().email("Correo inválido").max(120);

export const fechaISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: AAAA-MM-DD");

export const texto = (min: number, max: number) => z.string().trim().min(min, `Mínimo ${min} caracteres`).max(max, `Máximo ${max} caracteres`);

/** Parámetro de ruta :id */
export const esquemaId = z.object({ id: idPositivo });

/** Cuerpo { "estado": true | false } para activar o desactivar */
export const esquemaCambioEstado = z.object({
  estado: z.boolean({ required_error: "El estado es obligatorio", invalid_type_error: "El estado debe ser true o false" }),
});
export type CambioEstadoDto = z.infer<typeof esquemaCambioEstado>;

export const exigirAlgunCampo = (datos: object) => Object.keys(datos).length > 0;
export const MENSAJE_SIN_CAMPOS = "Debes enviar al menos un campo para actualizar";
