import { CustomerSeed } from '../customer/Seed';
import { ICustomer } from '../customer/Types';
import { validateCustomerAuthenticate } from './Validation';

const data = CustomerSeed.data[0];

describe('AuthValidation', () => {
  it('should validate user successfully', () => {
    const [parsedData, err] = validateCustomerAuthenticate(data);

    expect(err).toBeUndefined();
    expect(parsedData).toEqual(data);
  });

  it('should return error in validation', () => {
    const _data: Partial<ICustomer> = {
      ...data,
      email: undefined,
    };
    const [parsedData, err] = validateCustomerAuthenticate(_data);

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });
});
