import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pool } from './config/db';
import { ROLES } from './utils/roles';

const ROLES_INICIALES: [string, string][] = [
  [ROLES.ADMIN, 'Gestiona usuarios, roles, pacientes, medicamentos y auditoría'],
  [ROLES.MEDICO, 'Crea y gestiona órdenes médicas'],
  [ROLES.ENFERMERIA, 'Registra la aplicación de medicamentos'],
  [ROLES.FARMACEUTICO, 'Gestiona lotes y dispensa medicamentos'],
  [ROLES.PSICOLOGIA, 'Consulta de pacientes'],
];

// [rol, tipo_doc, documento, nombres, apellidos, correo, especialidad]
const USUARIOS: [string, string, string, string, string, string, string][] = [
  [ROLES.ADMIN, 'CC', '1000000001', 'Admin', 'Sistemas', 'admin@sigap.com', 'Administración'],
  [ROLES.MEDICO, 'CC', '1000000002', 'Carlos', 'Méndez', 'carlos.mendez@sigap.com', 'Psiquiatría Adultos'],
  [ROLES.MEDICO, 'CC', '1000000003', 'Elena', 'Restrepo', 'elena.restrepo@sigap.com', 'Psiquiatría Infantil'],
  [ROLES.ENFERMERIA, 'CC', '1000000004', 'Laura', 'Londoño', 'laura.londono@sigap.com', 'Enfermería Psiquiátrica'],
  [ROLES.ENFERMERIA, 'CC', '1000000005', 'Jorge', 'Ramírez', 'jorge.ramirez@sigap.com', 'Enfermería Urgencias'],
  [ROLES.PSICOLOGIA, 'CC', '1000000006', 'Samanta', 'Torres', 'samanta.torres@sigap.com', 'Psicología'],
  [ROLES.FARMACEUTICO, 'CC', '1000000007', 'Camilo', 'Pardo', 'camilo.pardo@sigap.com', 'Farmacia'],
];

async function main() {
  if (process.argv.includes('--reset')) {
    const sql = fs.readFileSync(path.resolve(process.cwd(), 'Backend/sql/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Esquema recreado desde Backend/sql/schema.sql');
  }

  for (const [nombre, descripcion] of ROLES_INICIALES) {
    await pool.query('INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING', [
      nombre, descripcion,
    ]);
  }
  const { rows } = await pool.query('SELECT id_rol, nombre FROM roles');
  const idRol = Object.fromEntries(rows.map((r) => [r.nombre, r.id_rol as number]));

  // Las contraseñas de prueba NO van en el código ni en la documentación:
  // se toman de SEED_PASSWORD o se generan al azar y se muestran una sola vez.
  const generada = !process.env.SEED_PASSWORD;
  const password = process.env.SEED_PASSWORD ?? `${crypto.randomBytes(5).toString('hex')}A1`;
  const hash = await bcrypt.hash(password, 10);

  for (const [rol, tipo, doc, nombres, apellidos, correo, especialidad] of USUARIOS) {
    await pool.query(
      `INSERT INTO usuarios (id_rol, tipo_documento, documento, nombres, apellidos, correo, password_hash, especialidad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (correo) DO NOTHING`,
      [idRol[rol], tipo, doc, nombres, apellidos, correo, hash, especialidad]
    );
  }

  // Datos de ejemplo para probar el flujo orden -> dispensación -> aplicación
  await pool.query(
    `INSERT INTO pacientes (tipo_documento, documento, nombres, apellidos, fecha_nacimiento, genero)
     VALUES ('CC','2000000001','Juan','Pérez','1985-04-12','Masculino') ON CONFLICT (documento) DO NOTHING`
  );
  await pool.query(
    `INSERT INTO medicamentos (codigo_cums, nombre_generico, presentacion, concentracion, via_administracion, es_controlado, stock_minimo)
     VALUES ('CUMS-0001','Acetaminofén','Tableta','500 mg','Oral',FALSE,20),
            ('CUMS-0002','Clonazepam','Tableta','2 mg','Oral',TRUE,10)
     ON CONFLICT (codigo_cums) DO NOTHING`
  );
  const lotes = await pool.query('SELECT COUNT(*)::int AS n FROM lotes_medicamento');
  if (lotes.rows[0].n === 0) {
    await pool.query(
      `INSERT INTO lotes_medicamento (id_medicamento, num_lote, fecha_vence, stock_actual)
       SELECT id_medicamento, 'L-' || codigo_cums, CURRENT_DATE + INTERVAL '1 year', 100 FROM medicamentos`
    );
  }

  console.log(`Seed listo: ${ROLES_INICIALES.length} roles y ${USUARIOS.length} usuarios de prueba.`);
  console.log(
    generada
      ? `Contraseña de los usuarios de prueba (se muestra solo ahora): ${password}`
      : 'Contraseña de los usuarios de prueba: la definida en SEED_PASSWORD'
  );
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
