import Spinner from "./Spinner";

/**
 * Tabla de datos.
 * columnas: [{ clave: "nombres", titulo: "Nombres", alinear: "derecha", render: (fila) => ... }]
 * claveFila: nombre del campo único de cada fila (por ejemplo "id_paciente") o una función (fila) => id.
 */
export default function Table({
  columnas,
  filas = [],
  claveFila = "id",
  cargando = false,
  vacio = "No hay registros para mostrar.",
  descripcion,
}) {
  const obtenerClave = typeof claveFila === "function" ? claveFila : (fila) => fila[claveFila];

  return (
    <div className="tabla-contenedor" role="region" aria-label={descripcion} tabIndex={0}>
      <table className="tabla">
        {descripcion && <caption className="solo-lector">{descripcion}</caption>}
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={columna.alinear === "derecha" ? "ta-derecha" : undefined}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={columnas.length} className="tabla__estado">
                <Spinner etiqueta="Cargando datos" />
              </td>
            </tr>
          ) : filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="tabla__estado">
                {vacio}
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={obtenerClave(fila)}>
                {columnas.map((columna) => (
                  <td key={columna.clave} className={columna.alinear === "derecha" ? "ta-derecha" : undefined}>
                    {columna.render ? columna.render(fila) : fila[columna.clave] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
