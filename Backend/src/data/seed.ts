import fs from "fs";
import path from "path";
import { pool, cerrarConexion } from "./base-datos";
import { env } from "../config/env";
import { ROLES } from "../config/constantes";
import { hashearPassword } from "../utils/contrasenas";

const DESCRIPCION_ROLES: Record<string, string> = {
  [ROLES.ADMINISTRADOR]: "Gestiona usuarios, roles y consulta la auditoría",
  [ROLES.MEDICO]: "Registra y gestiona órdenes médicas",
  [ROLES.ENFERMERO_JEFE]: "Revisa órdenes y asigna enfermeros a las aplicaciones",
  [ROLES.ENFERMERO]: "Registra la administración de medicamentos",
  [ROLES.FARMACEUTICO]: "Gestiona lotes y dispensaciones",
};

const VIAS = ["Oral", "Intravenosa", "Intramuscular", "Subcutánea", "Tópica", "Inhalatoria", "Sublingual", "Rectal"];

async function sembrar(): Promise<void> {
  const rutaEsquema = path.resolve(process.cwd(), "src/data/schema.sql");
  await pool.query(fs.readFileSync(rutaEsquema, "utf8"));
  console.log("✔ Esquema verificado");

  // Orden de creación: 1 Administrador, 2 Médico, 3 Enfermero Jefe, 4 Enfermero, 5 Farmacéutico.
  for (const nombre of Object.values(ROLES)) {
    await pool.query(
      `INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING`,
      [nombre, DESCRIPCION_ROLES[nombre]]
    );
  }
  console.log("✔ Roles listos");

  for (const via of VIAS) {
    await pool.query(`INSERT INTO via_administracion (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING`, [via]);
  }
  console.log("✔ Vías de administración listas");

  const existente = await pool.query(`SELECT 1 FROM usuarios WHERE correo = $1`, [env.adminInicial.correo]);
  if (existente.rowCount === 0) {
    const rol = await pool.query(`SELECT id_rol FROM roles WHERE nombre = $1`, [ROLES.ADMINISTRADOR]);
    await pool.query(
      `INSERT INTO usuarios (id_rol, tipo_documento, documento, nombres, apellidos, correo, password_hash)
       VALUES ($1, 'CC', '0000000000', 'Administrador', 'SIGAM', $2, $3)`,
      [rol.rows[0].id_rol, env.adminInicial.correo, await hashearPassword(env.adminInicial.password)]
    );
    console.log(`✔ Administrador creado: ${env.adminInicial.correo}`);
  } else {
    console.log("• El administrador ya existía");
  }
}

sembrar()
  .catch((error) => {
    console.error("✖ Error en el seed:", error);
    process.exitCode = 1;
  })
  .finally(() => cerrarConexion());
