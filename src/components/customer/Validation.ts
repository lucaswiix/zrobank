import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  MinLength,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ApplicationError } from '../../error/Types';
import { INVALID_CUSTOMER } from './Errors';
import { ICustomer } from './Types';

class CustomerValidator implements Partial<ICustomer> {
  @IsOptional()
  key: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'O e-mail está inválido.',
    }
  )
  email: string;

  @MinLength(6, {
    message: 'A senha precisa ter pelo menos 6 dígitos.',
  })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsLatitude({
    message: 'O latitude está inválida.',
  })
  latitude: number;

  @IsNotEmpty()
  @IsLongitude({
    message: 'O longitude está inválida.',
  })
  longitude: number;

  @IsOptional()
  created_at: string;

  @IsOptional()
  updated_at: string;
}

export function validateCustomer(
  data: Partial<ICustomer>
): [Partial<ICustomer>, ApplicationError] {
  const validator = new CustomerValidator();
  Object.assign(validator, data);

  const errors: ValidationError[] = validateSync(validator, {
    forbidUnknownValues: true,
  });

  if (errors.length) {
    return [undefined, INVALID_CUSTOMER(errors)];
  }

  return [data, undefined];
}
