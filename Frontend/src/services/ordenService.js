import { api } from "./api";

export const ordenService = {
  async listar(filtros) {
    return await api.get("/ordenes", filtros);
  },
  async obtener(id) {
    return await api.get(`/ordenes/${id}`);
  },
  async crear(datos) {
    return await api.post("/ordenes", datos);
  },
  async cambiarEstado(id, estado) {
    return await api.patch(`/ordenes/${id}/estado`, { estado });
  },
};