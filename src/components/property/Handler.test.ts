import axios from 'axios';
import db from '../../sequelize/Sequelize';
import { API_URL, DEFAULT_TIMEOUT } from '../../test/config';
import { generateJWT } from '../auth/Security';
import { createCustomerTokenData } from '../customer/Seed';
import { PropertySampleData } from './Seed';

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
});

async function createClientWithAuth() {
  const jwtToken = await generateJWT(createCustomerTokenData());
  const axiosCreate = await axios.create({
    baseURL: API_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      Cookie: `zrobank_access_token_auth=${jwtToken}`,
    },
    validateStatus: () => true,
    withCredentials: true,
  });
  return axiosCreate;
}
