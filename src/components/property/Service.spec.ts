import { CustomerSeed } from '../customer/Seed';
import { PropertySeed } from './Seed';
import { PropertyService } from './Service';

afterEach(() => {
  jest.clearAllMocks();
});

describe('PropertyService', () => {
  const fnCreate = jest.fn((data, options) =>
    Promise.resolve(PropertySeed.data[0])
  );

  const fnFindAll = jest.fn((data, options) =>
    Promise.resolve(PropertySeed.data)
  );

  const fnCount = jest.fn(() => Promise.resolve(PropertySeed.data.length));
  const mockedPropertyModel = {
    create: fnCreate,
    findAll: fnFindAll,
    count: fnCount,
  };
  const mockedPropertyService = PropertyService({
    propertyModel: mockedPropertyModel as any,
  });
  describe('create', () => {
    it('should create a property successfully', async () => {
      const [property, error] = await mockedPropertyService.create(
        PropertySeed.data[0]
      );

      expect(error).toBeUndefined();
      expect(fnCreate).toBeCalledTimes(1);
      expect(property).toBeDefined();
    });

    it('should not create a property with invalid title', async () => {
      const [property, error] = await mockedPropertyService.create({
        ...PropertySeed.data[0],
        title: undefined,
      });

      expect(property).toBeUndefined();
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(fnCreate).not.toBeCalled();
    });

    it('should not create a property with invalid customer_key', async () => {
      const [property, error] = await mockedPropertyService.create({
        ...PropertySeed.data[0],
        customer_key: undefined,
      });

      expect(property).toBeUndefined();
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(fnCreate).not.toBeCalled();
    });
  });

  describe('findAll', () => {
    it('should findAll properties sucessfully', async () => {
      const [count, results] = await mockedPropertyService.findAll();

      expect(results.length).toBeGreaterThan(0);
      expect(count).toBeGreaterThan(0);
      expect(fnCount).toBeCalledTimes(1);
      expect(fnFindAll).toBeCalledTimes(1);
    });

    it('should findAll properties successfully with filter objct', async () => {
      const [count, results] = await mockedPropertyService.findAll({
        filter: {
          customer_name: 'lucas',
        },
        ctx: undefined,
      });

      expect(results.length).toBeGreaterThan(0);
      expect(count).toBeGreaterThan(0);
      expect(fnCount).toBeCalledTimes(1);
      expect(fnFindAll).toBeCalledTimes(1);
      expect(
        fnFindAll.mock.calls[0][0].include.some(
          (include) => include?.where?.name
        )
      ).toBe(true);
    });
    it('should findAll properties with type map', async () => {
      const [count, results] = await mockedPropertyService.findAll({
        filter: {
          type: 'map',
          latitude: CustomerSeed.data[0].latitude,
          longitude: CustomerSeed.data[0].longitude,
        },
        ctx: undefined,
      });

      const mockCall = fnFindAll.mock.calls[0][0];

      expect(results.length).toBeGreaterThan(0);
      expect(count).toBeGreaterThan(0);
      expect(fnCount).toBeCalledTimes(1);
      expect(fnFindAll).toBeCalledTimes(1);
      expect(typeof mockCall.order.val).toBe('string');
    });

    it('should return property with pagination ', async () => {
      const [count, results] = await mockedPropertyService.findAll({
        limit: 1,
        ctx: undefined,
      });

      const mockCall = fnFindAll.mock.calls[0][0];

      expect(results.length).toBeGreaterThan(0);
      expect(count).toBeGreaterThan(0);
      expect(fnCount).toBeCalledTimes(1);
      expect(fnFindAll).toBeCalledTimes(1);
      expect(mockCall.limit).toBe(1);
      expect(mockCall.offset).toBe(0);
    });
  });
});
