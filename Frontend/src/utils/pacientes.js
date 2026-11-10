const CAMPOS = [
  "tipo_documento",
  "documento",
  "nombres",
  "apellidos",
  "fecha_nacimiento",
  "genero",
  "telefono",
  "correo",
  "direccion",
];

const OBLIGATORIOS = ["tipo_documento", "documento", "nombres", "apellidos", "fecha_nacimiento", "genero"];

export const VALORES_VACIOS = Object.fromEntries(CAMPOS.map((campo) => [campo, ""]));

const comoTexto = (campo, valor) =>
  campo === "fecha_nacimiento" ? String(valor ?? "").slice(0, 10) : String(valor ?? "").trim();

/** Valores iniciales del formulario: vacíos para un paciente nuevo, o los datos del paciente a editar. */
export function valoresDesdePaciente(paciente) {
  if (!paciente) return { ...VALORES_VACIOS, tipo_documento: "CC" };
  return Object.fromEntries(CAMPOS.map((campo) => [campo, comoTexto(campo, paciente[campo])]));
}

/** Devuelve { campo: "mensaje" } con los campos obligatorios que faltan. */
export function validarObligatorios(valores, original = null) {
  const errores = {};
  for (const campo of OBLIGATORIOS) {
    const vacio = comoTexto(campo, valores[campo]) === "";
    // Al editar, solo es obligatorio lo que el paciente ya tenía guardado.
    const exigido = !original || comoTexto(campo, original[campo]) !== "";
    if (vacio && exigido) errores[campo] = "Este campo es obligatorio";
  }
  return errores;
}

/**
 * Datos que se envían a la API.
 * - Los campos vacíos no se envían (la API no acepta textos vacíos).
 * - Al editar, solo se envía lo que cambió.
 */
export function armarPayload(valores, original = null) {
  const payload = {};
  for (const campo of CAMPOS) {
    const nuevo = comoTexto(campo, valores[campo]);
    if (nuevo === "") continue;
    if (original && comoTexto(campo, original[campo]) === nuevo) continue;
    payload[campo] = nuevo;
  }
  return payload;
}
