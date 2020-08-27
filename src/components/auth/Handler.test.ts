import axios from 'axios';
import { ResponseAPI } from '../../handler/Types';
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
    it('should create a customer sucessfully', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        ...CustomerSeed.data[0],
        key: undefined,
        email: 'lucasrocha@zrobank.com',
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.error).toBeUndefined();
      expect(data.success).toBe(true);
    });

    it('should not create a customer with invalid email', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        ...CustomerSeed.data[0],
        key: undefined,
        email: 'lucas rocha',
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should not create a customer with exist email', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/register`, {
        ...CustomerSeed.data[0],
        email: CustomerSeed.data[0],
        key: undefined,
        password: '12345678',
        name: 'lucas rocha',
      });

      expect(data.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('/login', () => {
    it('should authenticate customer sucessfully', async () => {
      const { data }: { data: ResponseAPI } = await axiosClient.post(
        `${ENDPOINT}/login`,
        {
          email: CustomerSeed.data[0].email,
          password: 'abc123',
        }
      );

      expect(data.error).toBeUndefined();
      expect(data.data.token).toBeDefined();
      expect(typeof data.data.token).toBe('string');
      expect(data.success).toBe(true);
    });

    it('should not authenticate customer with invalid email', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/login`, {
        email: 'mailslucas@zrobank.com',
        password: 'abc123',
      });

      expect(data.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should not authenticate customer with invalid password', async () => {
      const { data } = await axiosClient.post(`${ENDPOINT}/login`, {
        email: CustomerSeed.data[0].email,
        password: '1234567',
      });

      expect(data.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});
