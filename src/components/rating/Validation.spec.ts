import { RatingSeed } from './Seed';
import { IRating } from './Types';
import { validateRating } from './Validation';

const data = RatingSeed.data[0];

describe('RatingValidation', () => {
  it('should validate rating successfully', () => {
    const [parsedData, err] = validateRating(data);

    expect(err).toBeUndefined();
    expect(parsedData).toEqual(data);
  });

  it('should failed on validate because rating is less than 1', () => {
    const [parsedData, err] = validateRating({ ...data, rating: 0 });

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });

  it('should failed on validate because rating is granter than 5', () => {
    const [parsedData, err] = validateRating({ ...data, rating: 10 });

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });

  it('should return error in validation', () => {
    const _data: Partial<IRating> = {
      ...data,
      rating: undefined,
    };
    const [parsedData, err] = validateRating(_data);

    expect(err).toBeDefined();
    expect(parsedData).toBeUndefined();
  });
});
