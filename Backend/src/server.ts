import { app } from "./app";
import { env } from "./config/env";
import { cerrarConexion, verificarConexion } from "./data/base-datos";

async function iniciar(): Promise<void> {
  await verificarConexion();
  console.log(`✔ Conectado a la base de datos "${env.baseDatos.nombre}"`);

  const servidor = app.listen(env.puerto, () => {
    console.log(`✔ SIGAM API escuchando en http://localhost:${env.puerto}/api`);
  });

  const apagar = (senal: string) => {
    console.log(`\n${senal} recibido, cerrando...`);
    servidor.close(async () => {
      await cerrarConexion();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => apagar("SIGINT"));
  process.on("SIGTERM", () => apagar("SIGTERM"));
}

iniciar().catch((error) => {
  console.error("✖ No se pudo iniciar el servidor:", error.message ?? error);
  process.exit(1);
});
