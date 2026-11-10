/**
 * Conexión con el backend. Todas las pantallas usan este archivo para hablar con la API.
 * - Agrega el token a cada petición.
 * - Devuelve directamente el campo "data" de la respuesta { ok, data, mensaje }.
 * - Si algo falla, lanza un ErrorApi con el mensaje que envía el servidor.
 */
const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const CLAVE_TOKEN = "sigam_token";

export const EVENTO_SESION_EXPIRADA = "sigam:sesion-expirada";

export class ErrorApi extends Error {
  constructor(mensaje, estado, detalles) {
    super(mensaje);
    this.name = "ErrorApi";
    this.estado = estado;
    this.detalles = detalles;
  }
}

// localStorage puede fallar (modo privado, bloqueado); por eso todo va dentro de try/catch.
export const token = {
  obtener() {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  },
  guardar(valor) {
    try {
      localStorage.setItem(CLAVE_TOKEN, valor);
    } catch {
      /* sin almacenamiento: la sesión dura solo mientras la pestaña esté abierta */
    }
  },
  borrar() {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
    } catch {
      /* nada que borrar */
    }
  },
};

async function solicitar(ruta, { metodo = "GET", cuerpo, parametros } = {}) {
  const consulta = parametros
    ? "?" + new URLSearchParams(Object.entries(parametros).filter(([, v]) => v !== undefined && v !== "")).toString()
    : "";

  const cabeceras = { Accept: "application/json" };
  if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";
  const tokenActual = token.obtener();
  if (tokenActual) cabeceras.Authorization = `Bearer ${tokenActual}`;

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}${consulta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi("No se pudo conectar con el servidor. Verifica que el backend esté en marcha.", 0);
  }

  let json = null;
  try {
    json = await respuesta.json();
  } catch {
    /* respuesta sin cuerpo JSON */
  }

  if (!respuesta.ok) {
    // Un 401 con sesión iniciada significa token vencido o inválido: se cierra la sesión.
    if (respuesta.status === 401 && tokenActual && !ruta.startsWith("/auth/login")) {
      token.borrar();
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    }
    throw new ErrorApi(json?.mensaje ?? "Ocurrió un error inesperado", respuesta.status, json?.detalles);
  }

  return json?.data ?? null;
}

export const api = {
  get: (ruta, parametros) => solicitar(ruta, { parametros }),
  post: (ruta, cuerpo) => solicitar(ruta, { metodo: "POST", cuerpo }),
  patch: (ruta, cuerpo) => solicitar(ruta, { metodo: "PATCH", cuerpo }),
};

/**
 * Convierte los "detalles" de un error 400 en { campo: mensaje } para mostrarlos en cada campo del formulario.
 * Ejemplo: [{ campo: "correo", mensaje: "Correo inválido" }]  ->  { correo: "Correo inválido" }
 */
export function mensajesPorCampo(error) {
  const campos = {};
  if (Array.isArray(error?.detalles)) {
    for (const detalle of error.detalles) {
      if (detalle.campo && !campos[detalle.campo]) campos[detalle.campo] = detalle.mensaje;
    }
  }
  return campos;
}
