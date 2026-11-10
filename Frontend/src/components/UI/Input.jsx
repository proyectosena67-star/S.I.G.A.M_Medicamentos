import { forwardRef, useId } from "react";

/**
 * Campo de texto con etiqueta, ayuda y mensaje de error.
 * error: texto que explica qué debe corregir la persona (por ejemplo, el detalle que devuelve la API).
 */
const Input = forwardRef(function Input(
  { etiqueta, error, ayuda, className = "", id, ...resto },
  ref
) {
  const idAuto = useId();
  const campoId = id ?? idAuto;
  const mensajeId = `${campoId}-mensaje`;

  return (
    <div className={`campo ${error ? "campo--error" : ""} ${className}`.trim()}>
      {etiqueta && <label htmlFor={campoId}>{etiqueta}</label>}
      <input
        ref={ref}
        id={campoId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || ayuda ? mensajeId : undefined}
        {...resto}
      />
      {(error || ayuda) && (
        <p id={mensajeId} className={error ? "campo__error" : "campo__ayuda"}>
          {error || ayuda}
        </p>
      )}
    </div>
  );
});

export default Input;
