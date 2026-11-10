/** Indicador de carga. */
export default function Spinner({ etiqueta = "Cargando", tamano = "md" }) {
  return (
    <span role="status" className={`spinner spinner--${tamano}`}>
      <span className="solo-lector">{etiqueta}</span>
    </span>
  );
}
