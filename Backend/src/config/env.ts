import dotenv from "dotenv";

dotenv.config();

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre} (revisa tu archivo .env)`);
  return valor;
}

export const env = {
  entorno: process.env.NODE_ENV ?? "development",
  puerto: Number(process.env.PORT ?? 3000),
  origenPermitido: process.env.CORS_ORIGIN ?? "*",
  baseDatos: {
    host: process.env.DB_HOST ?? "localhost",
    puerto: Number(process.env.DB_PORT ?? 5432),
    usuario: process.env.DB_USER ?? "postgres",
    clave: process.env.DB_PASSWORD ?? "",
    nombre: process.env.DB_NAME ?? "sigam_db",
  },
  jwt: {
    secreto: requerida("JWT_SECRET"),
    expiracion: process.env.JWT_EXPIRES_IN ?? "8h",
  },
  adminInicial: {
    correo: process.env.ADMIN_CORREO ?? "admin@sigam.com",
    password: process.env.ADMIN_PASSWORD ?? "Admin12345*",
  },
};

export const esProduccion = env.entorno === "production";
