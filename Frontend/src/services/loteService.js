const API_URL = "http://localhost:3000/api/lotes";

// Función auxiliar para obtener el token de autenticación
const obtenerHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const loteService = {
  async listar() {
    const respuesta = await fetch(API_URL, {
      headers: obtenerHeaders()
    });
    if (!respuesta.ok) {
      if (respuesta.status === 401) throw new Error("Sesión expirada o no autorizada. Inicia sesión nuevamente.");
      throw new Error("Error al cargar los lotes.");
    }
    return await respuesta.json();
  },

  async crear(datos) {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: obtenerHeaders(),
      body: JSON.stringify(datos),
    });
    if (!respuesta.ok) throw new Error("Error al registrar el lote.");
    return await respuesta.json();
  },

  async actualizar(id, datos) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: obtenerHeaders(),
      body: JSON.stringify(datos),
    });
    if (!respuesta.ok) throw new Error("Error al actualizar el lote.");
    return await respuesta.json();
  }
};