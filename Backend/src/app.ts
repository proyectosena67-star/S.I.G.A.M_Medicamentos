import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env, esProduccion } from "./config/env";
import { manejadorErrores } from "./middlewares/manejador-errores.middleware";
import { rutaNoEncontrada } from "./middlewares/ruta-no-encontrada.middleware";
import rutas from "./routes";

export const app = express();

app.set("trust proxy", esProduccion ? 1 : false); // en producción, detrás de un proxy, para obtener la IP real
app.use(helmet());
app.use(cors({ origin: env.origenPermitido }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", rutas);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);
