import { api } from "./api";

/**
 * Servicio de lotes. Usa api.js, que ya agrega el token de la sesión ("sigam_token"),
 * muestra los errores del servidor en español y cierra la sesión si el token vence.
 *
 * Cada función devuelve directamente los datos:
 *   listar()      -> arreglo de lotes
 *   crear()       -> el lote creado
 *   actualizar()  -> el lote actualizado
 */
export const loteService = {
  listar: () => api.get("/lotes"),
  obtener: (id) => api.get(`/lotes/${id}`),
  crear: (datos) => api.post("/lotes", datos),
  actualizar: (id, datos) => api.patch(`/lotes/${id}`, datos),
};