import 'dotenv/config';

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable ${nombre} en el archivo .env`);
  return valor;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: (): string => requerida('JWT_SECRET'),
  jwtExpires: process.env.JWT_EXPIRES ?? '8h',
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'sigam',
  },
};
