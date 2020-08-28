import { ApplicationError } from './Types';

export enum ErrorCodes {
  INVALID_PARAM = 1,
  NOT_FOUND = 2,
  UNIQUE_CONSTRAINT_VIOLATION = 3,
  INVALID_AUTH = 4,
  DEFAULT_ERROR = 5,
}
export const INVALID_PARAM = (
  paramName: string,
  paramValue?: string,
  message = 'Dados inválidos'
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.INVALID_PARAM,
  type: 'INVALID_PARAM',
  message,
  description: paramValue
    ? `Value ${paramValue} of parameter ${paramName} is invalid`
    : `${paramName} parameter is invalid`,
});

export const INVALID_KEY = (
  key: any,
  message?: string,
  description?: string
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.INVALID_PARAM,
  type: 'INVALID_KEY',
  message: message || 'Chave inválida',
  description: description || `Key ${key} is invalid`,
});

export const NOT_FOUND = (
  message: string = 'Não encontrado'
): ApplicationError => ({
  status: 404,
  code: ErrorCodes.NOT_FOUND,
  type: 'NOT_FOUND',
  message,
  description: `Resource not found.`,
});

export const INVALID_EMAIL: ApplicationError = {
  status: 401,
  code: ErrorCodes.INVALID_AUTH,
  type: 'INVALID_AUTH',
  message: 'Este email já está sendo usado por outro número.',
  description: 'This email is already being used by another number.',
};

export const UNIQUE_CONSTRAINT_VIOLATION = (
  message: string = 'Dado único duplicado'
): ApplicationError => ({
  status: 422,
  code: ErrorCodes.UNIQUE_CONSTRAINT_VIOLATION,
  type: 'UNIQUE_CONSTRAINT_VIOLATION',
  message,
  description: `Unique constraint violation.`,
});
