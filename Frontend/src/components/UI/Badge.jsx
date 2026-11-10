/** Etiqueta de color. tono: "ok" | "alerta" | "peligro" | "info" | "neutro" */
export default function Badge({ tono = "neutro", children }) {
  return <span className={`badge badge--${tono}`}>{children}</span>;
}

// Estados que usa la base de datos y el color con el que se muestra cada uno.
const ESTADOS = {
  activa: ["info", "Activa"],
  finalizada: ["neutro", "Finalizada"],
  cancelada: ["peligro", "Cancelada"],
  pendiente: ["alerta", "Pendiente"],
  administrada: ["ok", "Administrada"],
  omitida: ["neutro", "Omitida"],
};

/**
 * Muestra un estado ya con su color y texto.
 * Acepta los textos de órdenes y aplicaciones ("activa", "pendiente"...) o un booleano (activo / inactivo).
 */
export function EstadoBadge({ estado }) {
  if (typeof estado === "boolean") {
    return <Badge tono={estado ? "ok" : "neutro"}>{estado ? "Activo" : "Inactivo"}</Badge>;
  }
  const [tono, texto] = ESTADOS[estado] ?? ["neutro", String(estado)];
  return <Badge tono={tono}>{texto}</Badge>;
}
