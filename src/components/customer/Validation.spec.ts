import { CustomerSeed } from './Seed';
import { ICustomer } from './Types';
import { validateCustomer } from './Validation';

const data = CustomerSeed.data[0];

describe('CustomerValidation', () => {
  it('should validate user successfully', () => {
    const [parsedData, err] = validateCustomer(data);

    expect(err).toBeUndefined();
    expect(parsedData).toEqual(data);
  });

  it('should return error in validation', () => {
    const _data: Partial<ICustomer> = {
      ...data,
      name: undefined,
      email: undefined,
    };
    const [parsedData, err] = validateCustomer(_data);

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });
});
