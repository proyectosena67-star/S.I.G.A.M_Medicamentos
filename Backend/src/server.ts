import app from './app';
import { pool } from './config/db';
import { env } from './config/env';

async function iniciar() {
  env.jwtSecret(); // falla de inmediato si falta JWT_SECRET en .env
  await pool.query('SELECT 1'); // falla de inmediato si no hay conexión a PostgreSQL

  app.listen(env.port, () => {
    console.log(`S.I.G.A.M. API escuchando en http://localhost:${env.port}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
