import { Paciente } from "../models/paciente.model";
import { RepositorioBase } from "./repositorio.base";

class PacienteRepository extends RepositorioBase<Paciente> {
  constructor() {
    super("pacientes", "id_paciente", [
      "tipo_documento", "documento", "nombres", "apellidos", "fecha_nacimiento",
      "genero", "telefono", "correo", "direccion", "estado",
    ]);
  }
}

export const pacienteRepository = new PacienteRepository();
