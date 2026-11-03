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

app.set("trust proxy", esProduccion ? 1 : false);
app.use(helmet());
app.use(cors({ origin: env.origenPermitido }));
app.use(express.json({ limit: "1mb" }));

// --- CONFIGURACIÓN DE SWAGGER ---
try {
  // Ajusta la ruta dependiendo de dónde guardaste el archivo swagger_sigam_api.json.
  // Si está dentro de la carpeta Backend (al mismo nivel que package.json), usa '../swagger_sigam_api.json'
  const swaggerPath = path.join(__dirname, "../swagger_sigam_api.json");
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument as any));
  console.log(" Documentación de Swagger lista en http://localhost:3000/api-docs");
} catch (error) {
  console.error(" No se pudo cargar el archivo de Swagger:", error);
}
// -------------------------------

app.use("/api", rutas);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);