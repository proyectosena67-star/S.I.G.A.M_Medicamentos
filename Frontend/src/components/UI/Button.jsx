/**
 * Botón de la aplicación.
 * variante: "primario" | "secundario" | "peligro" | "texto"
 * cargando: muestra un indicador y bloquea el botón mientras se espera al servidor.
 */
export default function Button({
  variante = "primario",
  tamano = "md",
  cargando = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...resto
}) {
  const clases = ["btn", `btn--${variante}`, tamano === "sm" ? "btn--sm" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {cargando && <span className="spinner spinner--sm" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
