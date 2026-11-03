import bcrypt from "bcryptjs";
import crypto from "crypto";

const RONDAS = 10;

export const hashearPassword = (password: string): Promise<string> => bcrypt.hash(password, RONDAS);

export const compararPassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);

/** Contraseña temporal de 12 caracteres con mayúscula, minúscula, número y símbolo. */
export function generarPasswordTemporal(): string {
  const mayusculas = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const minusculas = "abcdefghijkmnpqrstuvwxyz";
  const numeros = "23456789";
  const simbolos = "*#$%&";
  const elegir = (texto: string) => texto[crypto.randomInt(texto.length)];
  const base = [elegir(mayusculas), elegir(minusculas), elegir(numeros), elegir(simbolos)];
  const todos = mayusculas + minusculas + numeros;
  while (base.length < 12) base.push(elegir(todos));
  // Mezcla Fisher-Yates con aleatoriedad criptográfica.
  for (let i = base.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [base[i], base[j]] = [base[j], base[i]];
  }
  return base.join("");
}
