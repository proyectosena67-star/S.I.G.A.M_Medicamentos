const CAMPOS = [
  "codigo_cums",
  "nombre_generico",
  "nombre_comercial",
  "tipo_medicamento",
  "es_controlado",
  "stock_minimo",
  "estado",
];

const OBLIGATORIOS = [
  "codigo_cums",
  "nombre_generico",
  "nombre_comercial",
  "tipo_medicamento",
  "stock_minimo",
];

export const VALORES_VACIOS = {
  codigo_cums: "",
  nombre_generico: "",
  nombre_comercial: "",
  tipo_medicamento: "",
  es_controlado: false,
  stock_minimo: 10,
  estado: true,
};

const comoTexto = (campo, valor) => {
  if (campo === "es_controlado" || campo === "estado") {
    return Boolean(valor);
  }
  if (campo === "stock_minimo") {
    return valor !== "" && valor !== null && valor !== undefined ? Number(valor) : "";
  }
  return String(valor ?? "").trim();
};

/** Valores iniciales del formulario: vacíos para un medicamento nuevo, o los datos del medicamento a editar. */
export function valoresDesdeMedicamento(medicamento) {
  if (!medicamento) return { ...VALORES_VACIOS };
  return Object.fromEntries(
    CAMPOS.map((campo) => [campo, comoTexto(campo, medicamento[campo])])
  );
}

/** Devuelve { campo: "mensaje" } con los campos obligatorios que faltan. */
export function validarObligatorios(valores, original = null) {
  const errores = {};
  for (const campo of OBLIGATORIOS) {
    const val = comoTexto(campo, valores[campo]);
    const vacio = val === "" || val === null || val === undefined;
    
    // Al editar, solo es obligatorio lo que el medicamento ya tenía guardado.
    const exigido = !original || comoTexto(campo, original[campo]) !== "";
    if (vacio && exigido) errores[campo] = "Este campo es obligatorio";
  }

  if (valores.stock_minimo !== "" && Number(valores.stock_minimo) < 0) {
    errores.stock_minimo = "El stock mínimo no puede ser negativo";
  }

  return errores;
}

/** Prepara únicamente los datos que han sido modificados al editar o el objeto completo al crear. */
export function armarPayload(valores, original = null) {
  if (!original) {
    return {
      ...valores,
      stock_minimo: Number(valores.stock_minimo),
    };
  }

  const payload = {};
  for (const campo of CAMPOS) {
    const actual = comoTexto(campo, valores[campo]);
    const previo = comoTexto(campo, original[campo]);
    if (actual !== previo) {
      payload[campo] = actual;
    }
  }
  return payload;
}