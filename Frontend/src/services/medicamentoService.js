import { api } from "./api";

export const medicamentoService = {
  listar: () => api.get("/medicamentos"),
  obtener: (id) => api.get(`/medicamentos/${id}`),
  crear: (datos) => api.post("/medicamentos", datos),
  actualizar: (id, datos) => api.patch(`/medicamentos/${id}`, datos),
  cambiarEstado: (id, estado) => api.patch(`/medicamentos/${id}/estado`, { estado }),
};