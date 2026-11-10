import { useEffect, useId, useRef } from "react";

/**
 * Ventana emergente. Se cierra con Esc, con la X o al pulsar fuera del panel.
 * pie: contenido de la parte inferior (normalmente los botones de acción).
 * ancho: "sm" | "md" | "lg"
 */
export default function Modal({ abierto, titulo, onCerrar, children, pie, ancho = "md" }) {
  const tituloId = useId();
  const panelRef = useRef(null);
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar; // así el efecto no se repite cuando cambia la función

  useEffect(() => {
    if (!abierto) return undefined;

    const previo = document.activeElement;
    const desbordeOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const alPulsarTecla = (evento) => {
      if (evento.key === "Escape") cerrarRef.current?.();
    };
    document.addEventListener("keydown", alPulsarTecla);

    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = desbordeOriginal;
      previo?.focus?.();
    };
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div
      className="modal-fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar?.();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className={`modal modal--${ancho}`}
      >
        <header className="modal__cabecera">
          <h2 id={tituloId}>{titulo}</h2>
          <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
        {pie && <footer className="modal__pie">{pie}</footer>}
      </div>
    </div>
  );
}
