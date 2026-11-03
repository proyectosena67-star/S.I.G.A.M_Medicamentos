import { Request, Response } from "express";

export function responder<T>(res: Response, datos: T, estado = 200, mensaje?: string): void {
  res.status(estado).json({ ok: true, ...(mensaje ? { mensaje } : {}), data: datos });
}

/** Lee un parámetro numérico de la ruta (ya validado por validarId). */
export function leerId(req: Request, nombre = "id"): number {
  return Number(req.params[nombre]);
}

/** IP del cliente para la auditoría. */
export function obtenerIp(req: Request): string {
  return (req.ip ?? req.socket.remoteAddress ?? "desconocida").replace("::ffff:", "");
}
