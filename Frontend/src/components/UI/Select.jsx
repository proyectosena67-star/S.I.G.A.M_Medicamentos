import { forwardRef, useId } from "react";

/**
 * Lista desplegable.
 * opciones: [{ valor: 1, etiqueta: "Oral" }, ...]
 * marcador: texto de la opción vacía inicial (value="").
 */
const Select = forwardRef(function Select(
  { etiqueta, opciones = [], marcador = "Selecciona una opción", error, ayuda, className = "", id, ...resto },
  ref
) {
  const idAuto = useId();
  const campoId = id ?? idAuto;
  const mensajeId = `${campoId}-mensaje`;

  return (
    <div className={`campo ${error ? "campo--error" : ""} ${className}`.trim()}>
      {etiqueta && <label htmlFor={campoId}>{etiqueta}</label>}
      <select
        ref={ref}
        id={campoId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || ayuda ? mensajeId : undefined}
        {...resto}
      >
        <option value="">{marcador}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {(error || ayuda) && (
        <p id={mensajeId} className={error ? "campo__error" : "campo__ayuda"}>
          {error || ayuda}
        </p>
      )}
    </div>
  );
});

export default Select;
