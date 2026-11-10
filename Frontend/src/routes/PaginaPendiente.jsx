import Alert from "../components/UI/Alert";

/** Pantalla temporal para los módulos que todavía no se han construido. */
export default function PaginaPendiente({ titulo }) {
  return (
    <div className="pagina">
      <h1>{titulo}</h1>
      <Alert tono="info">Esta sección se construirá en el siguiente paso.</Alert>
    </div>
  );
}
