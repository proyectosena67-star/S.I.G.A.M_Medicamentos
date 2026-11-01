import { Ejecutor, pool } from "../data/base-datos";
import { AplicacionImagen } from "../models/aplicacion-imagen.model";
import { RepositorioBase } from "./repositorio.base";

class AplicacionImagenRepository extends RepositorioBase<AplicacionImagen> {
  constructor() {
    super("aplicacion_imagen", "id_imagen", ["id_aplicacion", "url"]);
  }

  async listarPorAplicacion(idAplicacion: number, ejecutor: Ejecutor = pool): Promise<AplicacionImagen[]> {
    const resultado = await ejecutor.query(
      `SELECT * FROM aplicacion_imagen WHERE id_aplicacion = $1 ORDER BY id_imagen`,
      [idAplicacion]
    );
    return resultado.rows;
  }
}

export const aplicacionImagenRepository = new AplicacionImagenRepository();
