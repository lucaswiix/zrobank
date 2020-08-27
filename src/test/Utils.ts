import axios from 'axios';
import { generateJWT } from '../components/auth/Security';
import { createCustomerTokenData } from '../components/customer/Seed';
import { API_URL, DEFAULT_TIMEOUT } from './config';

export async function createClientWithAuth() {
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
