import { Router } from "express";
import { pool } from "../data/base-datos";
import aplicacionRoutes from "./aplicacion.routes";
import auditoriaRoutes from "./auditoria.routes";
import authRoutes from "./auth.routes";
import dispensacionRoutes from "./dispensacion.routes";
import loteMedicamentoRoutes from "./lote-medicamento.routes";
import medicamentoRoutes from "./medicamento.routes";
import ordenMedicaRoutes from "./orden-medica.routes";
import pacienteRoutes from "./paciente.routes";
import rolRoutes from "./rol.routes";
import usuarioRoutes from "./usuario.routes";
import viaAdministracionRoutes from "./via-administracion.routes";

const router = Router();

router.get("/health", async (_req, res) => {
  let baseDatos = "conectada";
  try {
    await pool.query("SELECT 1");
  } catch {
    baseDatos = "sin conexión";
  }
  res.status(baseDatos === "conectada" ? 200 : 503).json({
    ok: baseDatos === "conectada",
    service: "SIGAM API",
    baseDatos,
    fecha: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/roles", rolRoutes);
router.use("/pacientes", pacienteRoutes);
router.use("/medicamentos", medicamentoRoutes);
router.use("/vias-administracion", viaAdministracionRoutes);
router.use("/lotes", loteMedicamentoRoutes);
router.use("/ordenes", ordenMedicaRoutes);
router.use("/aplicaciones", aplicacionRoutes);
router.use("/dispensaciones", dispensacionRoutes);
router.use("/auditoria", auditoriaRoutes);

export default router;
