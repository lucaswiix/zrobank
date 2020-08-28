import { PropertySeed } from '../property/Seed';
import { RatingSeed } from './Seed';
import { RatingService } from './Service';
afterEach(() => {
  jest.clearAllMocks();
});

describe('RatingService', () => {
  const fnCreate = jest.fn((data, ops) => Promise.resolve(RatingSeed.data[0]));
  const fnCount = jest.fn((ops) =>
    Promise.resolve(
      RatingSeed.data.filter(
        (rating) => rating.property_key === ops?.where?.property_key
      ).length
    )
  );
  const fnFindAll = jest.fn((ops) => Promise.resolve(RatingSeed.data));
  const mockRatingModel = {
    create: fnCreate,
    findAll: fnFindAll,
    count: fnCount,
  };

  const fnPropertyfindByPk = jest.fn((key) =>
    Promise.resolve(
      PropertySeed.data.filter((property) => property.key === key)
    )
  );
  const mockPropertyModel = {
    findByPk: fnPropertyfindByPk,
  };
  const mockRatingService = RatingService({
    ratingModel: mockRatingModel as any,
    propertyModel: mockPropertyModel as any,
  });

  describe('create', () => {
    it('should create rating successfully', async () => {
      const [result, err] = await mockRatingService.create({
        ...RatingSeed.data[0],
        key: undefined,
      });

      expect(err).toBeUndefined();
      expect(result).toBeDefined();
      expect(fnCreate).toBeCalledTimes(1);
    });
    it('should failed on create rating with invalid params', async () => {
      const [result, err] = await mockRatingService.create({
        ...RatingSeed.data[0],
        key: undefined,
        rating: undefined,
      });

      expect(err).toBeDefined();
      expect(err.status).toBe(400);
      expect(result).toBeUndefined();
      expect(fnCreate).not.toBeCalled();
    });
  });

  describe('findAll', () => {
    it('should findAll rating by propertyKey', async () => {
      const [count, results] = await mockRatingService.findAll(
        PropertySeed.data[0].key
      );
      expect(fnFindAll).toBeCalledTimes(1);
      expect(fnCount).toBeCalledTimes(1);
      expect(fnFindAll.mock.calls[0][0].where.property_key).toBe(
        PropertySeed.data[0].key
      );
      expect(typeof count).toBe('number');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should still find all rating with invalid property key', async () => {
      const invalidPropertyKey = '12312312312';
      const [count, results] = await mockRatingService.findAll(
        invalidPropertyKey
      );
      expect(fnFindAll).toBeCalledTimes(1);
      expect(fnCount).toBeCalledTimes(1);
      expect(typeof count).toBe('number');
      expect(fnFindAll.mock.calls[0][0].where.property_key).toBe(
        invalidPropertyKey
      );
      expect(results.length).toBeGreaterThan(0);
    });

    it('should still find all rating with invalid undefined property key', async () => {
      const [count, results] = await mockRatingService.findAll(undefined);
      expect(fnFindAll).toBeCalledTimes(1);
      expect(fnCount).toBeCalledTimes(1);
      expect(typeof count).toBe('number');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
