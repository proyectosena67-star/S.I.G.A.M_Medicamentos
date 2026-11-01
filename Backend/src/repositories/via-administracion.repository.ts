import { ViaAdministracion } from "../models/via-administracion.model";
import { RepositorioBase } from "./repositorio.base";

class ViaAdministracionRepository extends RepositorioBase<ViaAdministracion> {
  constructor() {
    super("via_administracion", "id_via", ["nombre", "estado"]);
  }
}

export const viaAdministracionRepository = new ViaAdministracionRepository();
