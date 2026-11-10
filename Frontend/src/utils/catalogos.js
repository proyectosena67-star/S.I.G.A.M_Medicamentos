// Opciones de las listas desplegables. Los valores deben coincidir con los que acepta el backend.
export const TIPOS_DOCUMENTO = [
  { valor: "CC", etiqueta: "Cédula de ciudadanía" },
  { valor: "TI", etiqueta: "Tarjeta de identidad" },
  { valor: "CE", etiqueta: "Cédula de extranjería" },
  { valor: "PA", etiqueta: "Pasaporte" },
  { valor: "RC", etiqueta: "Registro civil" },
  { valor: "PEP", etiqueta: "Permiso especial (PEP)" },
];

export const GENEROS = [
  { valor: "M", etiqueta: "Masculino" },
  { valor: "F", etiqueta: "Femenino" },
  { valor: "O", etiqueta: "Otro" },
];

/** Texto legible de un valor: etiquetaDe(GENEROS, "M") -> "Masculino" */
export function etiquetaDe(lista, valor) {
  return lista.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor ?? "—";
}
