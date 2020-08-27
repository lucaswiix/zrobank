import argon2 from 'argon2';
import { addMinutes } from 'date-fns';
import jwt from 'jwt-simple';
import GlobalConfig from '../../config/GlobalConfig';
import { ICustomer } from '../customer/Types';

const jwtSecret = GlobalConfig.USER_JWT_SECRET;
const jwtExpirationTime = GlobalConfig.USER_JWT_EXPIRATION_TIME;

export async function generatePasswordHash(password: string) {
  return await argon2.hash(password);
}

export async function comparePasswordHash(
  password: string,
  foundPassword: string
) {
  return await argon2.verify(foundPassword, password);
}

export async function generateJWT(user: Partial<ICustomer>) {
  const data = {
    exp: addMinutes(new Date(), jwtExpirationTime).getTime(),
    user: {
      key: user.key,
      name: user.name,
      email: user.email,
    },
  };

  return jwt.encode(data, jwtSecret);
}
