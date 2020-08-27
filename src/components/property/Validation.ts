import {
  IsNotEmpty,
  IsOptional,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ApplicationError } from '../../error/Types';
import { INVALID_PROPERTY } from './Errors';
import { IProperty } from './Types';

class PropertyValidator implements Partial<IProperty> {
  @IsOptional()
  key: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  customer_key: string;
}

export function validateProperty(
  data: Partial<IProperty>
): [Partial<IProperty>, ApplicationError] {
  const validator = new PropertyValidator();
  Object.assign(validator, data);

  const errors: ValidationError[] = validateSync(validator, {
    forbidUnknownValues: false,
  });

  if (errors.length) {
    return [undefined, INVALID_PROPERTY(errors)];
  }

  return [data, undefined];
}
