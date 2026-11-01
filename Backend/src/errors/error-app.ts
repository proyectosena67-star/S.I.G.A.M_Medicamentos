/** Error controlado de la aplicación: lleva el código HTTP y un mensaje legible. */
export class ErrorApp extends Error {
  constructor(
    public readonly estado: number,
    mensaje: string,
    public readonly detalles?: unknown
  ) {
    super(mensaje);
    this.name = new.target.name;
  }
}
