import { Medicamento } from "../models/medicamento.model";
import { RepositorioBase } from "./repositorio.base";

class MedicamentoRepository extends RepositorioBase<Medicamento> {
  constructor() {
    super("medicamentos", "id_medicamento", [
      "codigo_cums", "nombre_generico", "nombre_comercial", "tipo_medicamento",
      "es_controlado", "stock_minimo", "estado",
    ]);
  }
}

export const medicamentoRepository = new MedicamentoRepository();
