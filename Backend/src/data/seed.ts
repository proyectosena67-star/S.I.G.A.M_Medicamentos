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

  // 1. Roles
  for (const nombre of Object.values(ROLES)) {
    await pool.query(
      `INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING`,
      [nombre, DESCRIPCION_ROLES[nombre]]
    );
  }
  console.log("✔ Roles listos");

  // 2. Vías de administración
  for (const via of VIAS) {
    await pool.query(`INSERT INTO via_administracion (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING`, [via]);
  }
  console.log("✔ Vías de administración listas");

  // 3. Administrador inicial
  const existente = await pool.query(`SELECT 1 FROM usuarios WHERE correo = $1`, [env.adminInicial.correo]);
  if (existente.rowCount === 0) {
    const rolAdmin = await pool.query(`SELECT id_rol FROM roles WHERE nombre = $1`, [ROLES.ADMINISTRADOR]);
    await pool.query(
      `INSERT INTO usuarios (id_rol, tipo_documento, documento, nombres, apellidos, correo, password_hash)
       VALUES ($1, 'CC', '0000000000', 'Administrador', 'SIGAM', $2, $3)`,
      [rolAdmin.rows[0].id_rol, env.adminInicial.correo, await hashearPassword(env.adminInicial.password)]
    );
    console.log(`✔ Administrador creado: ${env.adminInicial.correo}`);
  } else {
    console.log("• El administrador ya existía");
  }

  // 4. NUEVO: Crear usuarios de prueba adicionales (Médico, Enfermero, etc.)
  const passwordDefault = await hashearPassword("Prueba123*"); // Contraseña común para pruebas

  const usuariosPrueba = [
    { rol: ROLES.MEDICO, doc: '11111111', nombres: 'House', correo: 'medico@sigam.com' },
    { rol: ROLES.ENFERMERO, doc: '22222222', nombres: 'Juan', correo: 'enfermero@sigam.com' },
    { rol: ROLES.FARMACEUTICO, doc: '33333333', nombres: 'Ana', correo: 'farmacia@sigam.com' },
    { rol: ROLES.ENFERMERO_JEFE, doc: '44444444', nombres: 'Maria', correo: 'enfermerojefe@sigam.com' }
  ];

  for (const u of usuariosPrueba) {
    const r = await pool.query(`SELECT id_rol FROM roles WHERE nombre = $1`, [u.rol]);
    if (r.rowCount > 0) {
      await pool.query(
        `INSERT INTO usuarios (id_rol, tipo_documento, documento, nombres, apellidos, correo, password_hash)
         VALUES ($1, 'CC', $2, $3, 'Prueba', $4, $5)
         ON CONFLICT (correo) DO NOTHING`,
        [r.rows[0].id_rol, u.doc, u.nombres, u.correo, passwordDefault]
      );
    }
  }
  console.log("✔ Usuarios de prueba listos");
}

sembrar()
  .catch((error) => {
    console.error("✖ Error en el seed:", error);
    process.exitCode = 1;
  })
  .finally(() => cerrarConexion());
