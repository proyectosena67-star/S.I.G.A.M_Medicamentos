export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly extra?: Record<string, unknown>
  ) {
    super(message);
    this.name = new.target.name;
  }
}
