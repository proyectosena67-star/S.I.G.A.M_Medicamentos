import { Ejecutor, pool } from "../data/base-datos";
import { OrdenMedica } from "../models/orden-medica.model";
import { FiltrosOrdenDto } from "../dtos/orden-medica.dto";
import { RepositorioBase } from "./repositorio.base";

const SELECT_ORDEN = `
  SELECT o.id_orden, o.id_usuario, o.id_paciente, o.detalles, o.estado, o.fecha_creacion,
         p.nombres || ' ' || p.apellidos AS paciente,
         u.nombres || ' ' || u.apellidos AS medico
  FROM orden_medica o
  JOIN pacientes p ON p.id_paciente = o.id_paciente
  JOIN usuarios u ON u.id_usuario = o.id_usuario`;

class OrdenMedicaRepository extends RepositorioBase<OrdenMedica> {
  constructor() {
    super("orden_medica", "id_orden", ["id_usuario", "id_paciente", "detalles", "estado"]);
  }

  async listarConFiltros(filtros: FiltrosOrdenDto, ejecutor: Ejecutor = pool): Promise<OrdenMedica[]> {
    const resultado = await ejecutor.query(
      `${SELECT_ORDEN}
       WHERE ($1::int IS NULL OR o.id_paciente = $1) AND ($2::text IS NULL OR o.estado = $2)
       ORDER BY o.id_orden DESC`,
      [filtros.id_paciente ?? null, filtros.estado ?? null]
    );
    return resultado.rows;
  }

  async buscarConNombres(id: number, ejecutor: Ejecutor = pool): Promise<OrdenMedica | null> {
    const resultado = await ejecutor.query(`${SELECT_ORDEN} WHERE o.id_orden = $1`, [id]);
    return resultado.rows[0] ?? null;
  }
}

export const ordenMedicaRepository = new OrdenMedicaRepository();
