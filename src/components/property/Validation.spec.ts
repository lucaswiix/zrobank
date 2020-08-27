import { PropertySeed } from './Seed';
import { IProperty } from './Types';
import { validateProperty } from './Validation';

const data = PropertySeed.data[0];

describe('PropertyValidation', () => {
  it('should validate user successfully', () => {
    const [parsedData, err] = validateProperty(data);

    expect(err).toBeUndefined();
    expect(parsedData).toEqual(data);
  });

  it('should return error in validation', () => {
    const _data: Partial<IProperty> = {
      ...data,
      title: undefined,
      latitude: undefined,
    };
    const [parsedData, err] = validateProperty(_data);

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });
});
