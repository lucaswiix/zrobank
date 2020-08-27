import db from '../../sequelize/Sequelize';
import { createClientWithAuth } from '../../test/Utils';
import { RatingSeed } from '../rating/Seed';
import { PropertySampleData, PropertySeed } from './Seed';
const ENDPOINT = '/api/v1/properties';
describe('PropertyHandler', () => {
  describe('GET /', () => {
    it('should return properties ordened by lat and long', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.get(`${ENDPOINT}?type=map`);

      expect(data.error).toBeUndefined();
      expect(data.results).toBeDefined();
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('should return properties ordened by title ', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.get(`${ENDPOINT}?type=list`);

      expect(data.error).toBeUndefined();
      expect(data.results).toBeDefined();
      expect(data.results.length).toBeGreaterThan(0);
    });
  });

  describe('POST /', () => {
    it('should create a property successfully', async () => {
      const axiosClient = await createClientWithAuth();
      const propertyObj = {
        ...PropertySampleData,
        key: undefined,
        title: 'titulo criei agora',
      };

      const { data } = await axiosClient.post(`${ENDPOINT}`, propertyObj);

      const [results] = await db.query(`
      SELECT count(1) from property where title = '${propertyObj.title}'`);

      expect(data.error).toBeUndefined();
      expect(data.success).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should failed on create property with invalid params', async () => {
      const axiosClient = await createClientWithAuth();
      const propertyObj = {
        ...PropertySampleData,
        key: undefined,
        title: undefined,
      };

      const { data } = await axiosClient.post(`${ENDPOINT}`, propertyObj);

      expect(data.error).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('GET /:propertyKey/ratings', () => {
    it('should return ratings by property key', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.get(
        `${ENDPOINT}/${PropertySeed.data[0].key}/ratings`
      );

      expect(data.error).toBeUndefined();
      expect(data.results).toBeDefined();
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('should return ratings by property key with ', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.get(`${ENDPOINT}/322/ratings`);

      expect(data.error).toBeUndefined();
      expect(data.results).toBeDefined();
    });
  });

  describe('POST /:propertyKey/ratings', () => {
    it('should create rating to a property ', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.post(
        `${ENDPOINT}/${PropertySeed.data[0].key}/ratings`,
        {
          ...RatingSeed.data[0],
          key: undefined,
          rating: 4,
          description: 'eae galera',
        }
      );

      expect(data.error).toBeUndefined();
      expect(data.success).toBe(true);
    });

    it('should failed create rating to property with invalid property', async () => {
      const axiosClient = await createClientWithAuth();
      const { data } = await axiosClient.post(`${ENDPOINT}/322/ratings`, {
        ...RatingSeed.data[0],
        rating: 4,
        description: 4,
      });

      expect(data.error).toBeDefined();
      expect(data.results).toBeUndefined();
    });
  });
});
