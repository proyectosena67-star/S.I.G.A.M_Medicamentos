const CAMPOS_SENSIBLES = ["password", "password_hash", "password_actual", "password_nueva", "token"];

/** Copia un objeto sin contraseñas ni tokens, para guardarlo en auditoría. */
export function quitarCamposSensibles(datos: unknown): Record<string, unknown> | null {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) return null;
  const copia: Record<string, unknown> = { ...(datos as Record<string, unknown>) };
  for (const campo of CAMPOS_SENSIBLES) delete copia[campo];
  return Object.keys(copia).length ? copia : null;
}
