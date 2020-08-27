import { ApplicationError, ErrorCodes } from '../../error/Types';

export enum AuthErrorCode {
  INVALID_LOGIN = 1,
  UNAUTHORIZED_USER = 2,
  USER_EMAIL_ALREADY_EXISTS = 3,
}

export const INVALID_LOGIN: ApplicationError = {
  status: 401,
  code: ErrorCodes.USER_PREFIX + AuthErrorCode.INVALID_LOGIN,
  type: 'INVALID_LOGIN',
  message: 'Usuário e/ou senha inválido(s)',
  description: 'Invalid login',
};

export const UNAUTHORIZED_USER = (): ApplicationError => ({
  status: 401,
  code: ErrorCodes.USER_PREFIX + AuthErrorCode.UNAUTHORIZED_USER,
  type: 'UNAUTHORIZED_USER',
  message: 'Usuário inválido',
  description: 'Customer is not authorized to access',
});

export const EMAIL_ALREADY_EXISTS = (): ApplicationError => ({
  status: 400,
  code: ErrorCodes.USER_PREFIX + AuthErrorCode.USER_EMAIL_ALREADY_EXISTS,
  type: 'USER_EMAIL_ALREADY_EXISTS',
  message: 'Este e-mail já está cadastrado',
  description: 'This email is already registered.',
});
