import axios from 'axios';
import { generateJWT } from '../components/auth/Security';
import { createCustomerTokenData } from '../components/customer/Seed';
import { ICustomer } from '../components/customer/Types';
import { API_URL, DEFAULT_TIMEOUT } from './config';

export async function createClientWithAuth(
  client: any,
  userSeed?: Partial<ICustomer>
) {
  const jwtToken = await generateJWT(createCustomerTokenData(userSeed));
  return client(API_URL, {
    axiosInstance: axios.create({
      baseURL: API_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        Cookie: `zrobank_access_token_auth=${jwtToken}`,
      },
      withCredentials: true,
    }),
  });
}
