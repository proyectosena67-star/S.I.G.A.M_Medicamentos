import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { env, esProduccion } from "./config/env";
import { manejadorErrores } from "./middlewares/manejador-errores.middleware";
import { rutaNoEncontrada } from "./middlewares/ruta-no-encontrada.middleware";
import rutas from "./routes";

export const app = express();

// Configuración de proxy (única vez)
app.set("trust proxy", esProduccion ? 1 : false);

// Middlewares de seguridad y optimización
app.use(helmet());
app.use(cors({ origin: env.origenPermitido }));
app.use(express.json({ limit: "1mb" }));

// --- CONFIGURACIÓN DE SWAGGER ---
try {
  const swaggerPath = path.join(__dirname, "../swagger_sigam_api.json");
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument as any));
  console.log("✔ Documentación de Swagger lista en http://localhost:3000/api-docs");
} catch (error) {
  console.error("✖ No se pudo cargar el archivo de Swagger:", error);
}

// --- RUTAS DE LA API ---
app.use("/api", rutas);

// --- MANEJO DE ERRORES Y RUTAS NO ENCONTRADAS (Se declaran una sola vez al final) ---
app.use(rutaNoEncontrada);
app.use(manejadorErrores);