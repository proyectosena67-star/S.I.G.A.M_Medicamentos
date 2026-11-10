import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Logo from "../components/UI/Logo";
import { useAuth } from "../hooks/useAuth";
import { mensajesPorCampo } from "../services/api";

export default function LoginPage() {
  const { usuario, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [verAyuda, setVerAyuda] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function alEnviar(evento) {
    evento.preventDefault();
    setError("");
    setErrores({});
    setEnviando(true);
    try {
      await iniciarSesion(correo.trim(), password);
      navegar(ubicacion.state?.desde?.pathname ?? "/", { replace: true });
    } catch (fallo) {
      setError(fallo.message);
      setErrores(mensajesPorCampo(fallo));
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <header className="login__banda login__banda--superior">
        <Logo variante="claro" />
      </header>

      <main className="login__centro">
        <section className="login__panel" aria-labelledby="titulo-login">
          <div className="login__marca">
            <Logo variante="oscuro" />
          </div>

          <h1 id="titulo-login" className="solo-lector">
            Iniciar sesión
          </h1>

          <form onSubmit={alEnviar} noValidate className="login__formulario">
            {error && <Alert tono="error">{error}</Alert>}
            <Input
              etiqueta="Correo"
              type="email"
              autoComplete="username"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
              required
            />
            <Input
              etiqueta="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errores.password}
              required
            />
            <button type="button" className="login__olvido" onClick={() => setVerAyuda((visible) => !visible)} aria-expanded={verAyuda}>
              ¿Olvidaste tu contraseña?
            </button>
            {verAyuda && (
              <Alert tono="info">Para restablecerla, comunícate con el administrador del sistema.</Alert>
            )}
            <Button type="submit" cargando={enviando}>
              Ingresar
            </Button>
          </form>
        </section>
      </main>

      <footer className="login__banda login__banda--inferior" />
    </div>
  );
}
