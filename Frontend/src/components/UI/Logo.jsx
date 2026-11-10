/**
 * Marca de la aplicación.
 * variante: "oscuro" (letras azules, para fondos claros) | "claro" (letras blancas, para la franja azul)
 */
export default function Logo({ variante = "oscuro", subtitulo = true }) {
  return (
    <span className={`logo logo--${variante}`}>
      <span className="logo__sigla">S.I.G.A.M.</span>
      {subtitulo && <span className="logo__texto">Sistema integral de gestión y administración médica</span>}
    </span>
  );
}
