import { api } from "./api";

/**
 * Servicio de dispensaciones. Usa api.js, que ya agrega el token de la sesión ("sigam_token"),
 * muestra los errores del servidor en español y cierra la sesión si el token vence.
 *
 * Cada función devuelve directamente los datos:
 *   listar()      -> arreglo de dispensaciones
 *   crear()       -> la dispensación creada
 */
export const dispensacionService = {
  listar: async () => {
    const respuesta = await api.get("/dispensaciones");
    // Extrae la propiedad 'data' de la respuesta del backend si viene envuelta
    return respuesta.data || respuesta;
  },
  obtener: (id) => api.get(`/dispensaciones/${id}`),
  crear: (datos) => api.post("/dispensaciones", datos),
};