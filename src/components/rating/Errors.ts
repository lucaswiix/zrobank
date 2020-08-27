import { ValidationError } from 'class-validator';
import { ApplicationError, ErrorCodes } from '../../error/Types';
import { buildDescription } from '../../error/Utilts';
enum RatingErrorCode {
  RATING_NOT_FOUND = 1,
  INVALID_RATING = 2,
  PROPERTY_NOT_FOUND_TO_RATING = 3,
}

export const INVALID_RATING = (
  fields?: ValidationError[]
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.RATING_PREFIX + RatingErrorCode.INVALID_RATING,
  type: 'INVALID_RATING',
  message: 'Dados inválidos para avaliação.',
  description: fields ? buildDescription(fields) : '',
  fields,
});

export const PROPERTY_NOT_FOUND_TO_RATING = (
  key: string
): ApplicationError => ({
  status: 400,
  code: ErrorCodes.RATING_PREFIX + RatingErrorCode.PROPERTY_NOT_FOUND_TO_RATING,
  type: 'PROPERTY_NOT_FOUND_TO_RATING',
  message: 'Imóvel não foi encontrado para avaliação',
  description: `Property (${key}) was not found to rating`,
});
