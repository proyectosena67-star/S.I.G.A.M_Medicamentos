/**
 * Mensaje destacado. tono: "error" | "exito" | "info" | "aviso"
 * Los errores se anuncian de inmediato a los lectores de pantalla.
 */
export default function Alert({ tono = "info", titulo, children, className = "" }) {
  return (
    <div className={`alerta alerta--${tono} ${className}`.trim()} role={tono === "error" ? "alert" : "status"}>
      {titulo && <p className="alerta__titulo">{titulo}</p>}
      {children && <div className="alerta__texto">{children}</div>}
    </div>
  );
}
