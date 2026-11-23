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
  
  // Estados nuevos para el icono del ojo y el modal de recuperación
  const [verPassword, setVerPassword] = useState(false);
  const [mostrarModalOlvido, setMostrarModalOlvido] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState("");

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

  async function alRecuperar(evento) {
    evento.preventDefault();
    setMensajeRecuperacion("");
    try {
      // Aquí puedes conectar con tu servicio o API de recuperación de contraseña si la tienes, por ejemplo:
      // await api.post('/auth/recuperar-password', { correo: correoRecuperacion });
      
      setMensajeRecuperacion("Si el correo está registrado, se han enviado las instrucciones.");
    } catch (fallo) {
      setMensajeRecuperacion("Hubo un error al intentar enviar la recuperación.");
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

            {/* Contenedor personalizado para incluir el input de contraseña junto al botón del icono de ojo */}
<div className="input-container-password" style={{ position: "relative" }}>
  <Input
    etiqueta="Contraseña"
    type={verPassword ? "text" : "password"}
    autoComplete="current-password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    error={errores.password}
    style={{ paddingRight: "40px" }}
    required
  />
  <button
    type="button"
    onClick={() => setVerPassword(!verPassword)}
    title={verPassword ? "Ocultar contraseña" : "Ver contraseña"}
    style={{
      position: "absolute",
      right: "12px",
      bottom: errores.password ? "32px" : "10px",
      width: "24px",
      height: "24px",
      padding: 0,
      margin: 0,
      background: "transparent",
      border: "none",
      boxShadow: "none",
      color: "#64748b",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {verPassword ? (
      /* Ojo abierto */
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      /* Ojo tachado (oculto) */
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </svg>
    )}
  </button>
</div>

            <button 
              type="button" 
              className="login__olvido" 
              onClick={() => setMostrarModalOlvido(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <Button type="submit" cargando={enviando}>
              Ingresar
            </Button>
          </form>
        </section>
      </main>

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {mostrarModalOlvido && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: "white", padding: "24px", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ marginBottom: "12px", fontSize: "1.25rem", fontWeight: "bold" }}>Recuperar Contraseña</h3>
            <p style={{ marginBottom: "16px", fontSize: "0.9rem", color: "#555" }}>
              Ingresa tu correo electrónico registrado para enviarte las instrucciones de restablecimiento.
            </p>
            
            <form onSubmit={alRecuperar} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="email"
                placeholder="correo@sigam.com"
                value={correoRecuperacion}
                onChange={(e) => setCorreoRecuperacion(e.target.value)}
                required
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              
              {mensajeRecuperacion && <Alert tono="info">{mensajeRecuperacion}</Alert>}
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalOlvido(false);
                    setMensajeRecuperacion("");
                    setCorreoRecuperacion("");
                  }}
                  style={{ padding: "8px 16px", background: "#e0e0e0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="login__banda login__banda--inferior" />
    </div>
  );
}