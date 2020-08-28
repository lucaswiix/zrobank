import {
  IsEmail,
  IsNotEmpty,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ApplicationError } from '../../error/Types';
import { ICustomer } from '../customer/Types';
import { INVALID_LOGIN } from './Errors';

class CustomerAuthValidator implements Partial<ICustomer> {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export function validateCustomerAuthenticate(
  data: Partial<ICustomer>
): [Partial<ICustomer>, ApplicationError] {
  const validator = new CustomerAuthValidator();
  Object.assign(validator, data);

  const errors: ValidationError[] = validateSync(validator, {
    forbidUnknownValues: true,
  });

  if (errors.length) {
    return [undefined, INVALID_LOGIN];
  }

  return [data, undefined];
}
