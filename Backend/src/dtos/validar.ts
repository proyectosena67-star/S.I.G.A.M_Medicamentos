import { z } from 'zod';
import { ValidationError } from '../errors';

const TIPOS: Record<string, string> = {
  string: 'texto', number: 'número', integer: 'número entero', boolean: 'verdadero o falso',
  array: 'lista', object: 'objeto', date: 'fecha',
};

// Mensajes de validación en español
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return {
        message:
          issue.received === 'undefined'
            ? 'es obligatorio'
            : `debe ser de tipo ${TIPOS[issue.expected] ?? issue.expected}`,
      };
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: issue.minimum === 1 ? 'no puede estar vacío' : `debe tener mínimo ${issue.minimum} caracteres` };
      }
      if (issue.type === 'array') return { message: `debe incluir al menos ${issue.minimum} elemento(s)` };
      return { message: issue.inclusive ? `debe ser mayor o igual a ${issue.minimum}` : `debe ser mayor que ${issue.minimum}` };
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') return { message: `no puede superar ${issue.maximum} caracteres` };
      return { message: `debe ser menor o igual a ${issue.maximum}` };
    case z.ZodIssueCode.invalid_string:
      return { message: issue.validation === 'email' ? 'no es un correo válido' : 'tiene un formato inválido' };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: `debe ser uno de: ${issue.options.join(', ')}` };
    default:
      return { message: ctx.defaultError };
  }
});

export function validar<S extends z.ZodTypeAny>(schema: S, datos: unknown): z.output<S> {
  const resultado = schema.safeParse(datos ?? {});
  if (!resultado.success) {
    const errores = resultado.error.issues.map((i) => ({
      campo: i.path.join('.') || 'body',
      mensaje: i.message,
    }));
    throw new ValidationError(
      `Datos inválidos: ${errores.map((e) => `${e.campo} ${e.mensaje}`).join('; ')}`,
      errores
    );
  }
  return resultado.data;
}
