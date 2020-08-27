import axios from 'axios';
import { API_URL, DEFAULT_TIMEOUT } from '../../test/config';
import { CustomerSeed } from '../customer/Seed';
const ENDPOINT = `/api/v1/auth`;

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
  validateStatus: () => true,
});

describe('AuthHandler', () => {
  describe('/register', () => {
    it('should create a user sucessfully', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        email: 'lucasrocha@zrobank.com',
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.error).toBeUndefined();
      expect(data.success).toBe(true);
    });

    it('should not create a user with invalid email', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        email: 'lucas rocha',
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should not create a user with exist email', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        email: CustomerSeed.data[0],
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
