import { ValidationError } from 'class-validator';
import { ApplicationError, ErrorCodes } from '../../error/Types';
import { buildDescription } from '../../error/Utilts';

export enum CustomerErrorCode {
  REAL_ESTATE_USER_NOT_FOUND = 1,
  INVALID_USER = 2,
  USER_NOT_FOUND = 3,
}

export const USER_NOT_FOUND = (key: string): ApplicationError => ({
  status: 404,
  code: ErrorCodes.USER_PREFIX + CustomerErrorCode.USER_NOT_FOUND,
  type: 'USER_NOT_FOUND',
  message: 'Usuário não encontrado',
  description: `Real Estate Customer (${key}) was not found`,
});

export const INVALID_USER = (fields?: ValidationError[]): ApplicationError => ({
  status: 400,
  code: ErrorCodes.USER_PREFIX + CustomerErrorCode.INVALID_USER,
  type: 'INVALID_USER',
  message: 'Dados inválidos para o usuário',
  description: fields ? buildDescription(fields) : '',
  fields,
});
