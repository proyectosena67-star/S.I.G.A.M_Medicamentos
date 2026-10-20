import { ConflictError } from './http.errors';

export function codigoDb(err: unknown): string {
  return typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
}

// Convierte el error de PostgreSQL por valor único duplicado (23505) en un 409 con un mensaje propio
export function duplicadoComo(err: unknown, mensaje: string): unknown {
  return codigoDb(err) === '23505' ? new ConflictError(mensaje) : err;
}
