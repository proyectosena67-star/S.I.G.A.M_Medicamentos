import { Rol } from "../models/rol.model";
import { RepositorioBase } from "./repositorio.base";

class RolRepository extends RepositorioBase<Rol> {
  constructor() {
    super("roles", "id_rol", ["nombre", "descripcion", "estado"]);
  }
}

export const rolRepository = new RolRepository();
