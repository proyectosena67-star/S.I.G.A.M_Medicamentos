import { api } from "./api";

export const pacienteService = {
  listar: () => api.get("/pacientes"),
  obtener: (id) => api.get(`/pacientes/${id}`),
  crear: (datos) => api.post("/pacientes", datos),
  actualizar: (id, datos) => api.patch(`/pacientes/${id}`, datos),
  cambiarEstado: (id, estado) => api.patch(`/pacientes/${id}/estado`, { estado }),
};
