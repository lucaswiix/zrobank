import { ValidationError } from 'class-validator';
import { ApplicationError, ErrorCodes } from '../../error/Types';
import { buildDescription } from '../../error/Utilts';

export enum CustomerErrorCode {
  REAL_ESTATE_CUSTOMER_NOT_FOUND = 1,
  INVALID_CUSTOMER = 2,
  CUSTOMER_NOT_FOUND = 3,
}

export const CUSTOMER_NOT_FOUND = (key: string): ApplicationError => ({
  status: 404,
  code: ErrorCodes.CUSTOMER_PREFIX + CustomerErrorCode.CUSTOMER_NOT_FOUND,
  type: 'CUSTOMER_NOT_FOUND',
  message: 'Usuário não encontrado',
  description: `Real Estate Customer (${key}) was not found`,
});

export const INVALID_CUSTOMER = (
  fields?: ValidationError[]
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.CUSTOMER_PREFIX + CustomerErrorCode.INVALID_CUSTOMER,
  type: 'INVALID_CUSTOMER',
  message: 'Dados inválidos para o usuário',
  description: fields ? buildDescription(fields) : '',
  fields,
});
