import { esquemaFiltrosAuditoria } from "../dtos/auditoria.dto";
import { validar } from "./validar.middleware";

export const validarFiltrosAuditoria = validar(esquemaFiltrosAuditoria, "query");
