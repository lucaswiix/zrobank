import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ApplicationError } from '../../error/Types';
import { INVALID_RATING } from './Errors';
import { IRating } from './Types';

class RatingValidator implements Partial<IRating> {
  @IsOptional()
  key: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  customer_key: string;

  @IsNotEmpty()
  property_key: string;
}

export function validateRating(
  data: Partial<IRating>
): [Partial<IRating>, ApplicationError] {
  const validator = new RatingValidator();
  Object.assign(validator, data);

  const errors: ValidationError[] = validateSync(validator, {
    forbidUnknownValues: false,
  });

  if (errors.length) {
    return [undefined, INVALID_RATING(errors)];
  }

  return [data, undefined];
}
