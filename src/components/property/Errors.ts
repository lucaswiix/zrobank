import { ValidationError } from 'class-validator';
import { ApplicationError, ErrorCodes } from '../../error/Types';
import { buildDescription } from '../../error/Utilts';
enum PropertyErrorCode {
  PROPERTY_NOT_FOUND = 1,
  INVALID_PROPERTY = 2,
}

export const PROPERTY_NOT_FOUND = (key: string): ApplicationError => ({
  status: 404,
  code: ErrorCodes.PROPERTY_PREFIX + PropertyErrorCode.PROPERTY_NOT_FOUND,
  type: 'PROPERTY_NOT_FOUND',
  message: 'Imóvel não encontrado',
  description: `Property (${key}) was not found`,
});

export const INVALID_PROPERTY = (
  fields?: ValidationError[]
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.PROPERTY_PREFIX + PropertyErrorCode.INVALID_PROPERTY,
  type: 'INVALID_PROPERTY',
  message: 'Dados inválidos para o imóvel',
  description: fields ? buildDescription(fields) : '',
  fields,
});
