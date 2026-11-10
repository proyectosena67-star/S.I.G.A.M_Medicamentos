/** "1985-06-15" -> "15/06/1985". Se separa el texto a mano para evitar corrimientos de zona horaria. */
export function formatearFecha(iso) {
  if (!iso) return "—";
  const [anio, mes, dia] = String(iso).slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

/** Edad en años cumplidos a partir de "AAAA-MM-DD". */
export function calcularEdad(iso, hoy = new Date()) {
  if (!iso) return null;
  const [anio, mes, dia] = String(iso).slice(0, 10).split("-").map(Number);
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  if (mesActual < mes || (mesActual === mes && hoy.getDate() < dia)) edad -= 1;
  return edad;
}

/** Minúsculas y sin tildes, para que buscar "jose" encuentre "José". */
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Fecha de hoy como "AAAA-MM-DD" (para limitar los campos de fecha). */
export function hoyISO() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}
