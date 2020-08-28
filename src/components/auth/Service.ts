import jwt from 'jwt-simple';
import { BaseOptions } from '../../common/Types';
import globalConfig from '../../config/GlobalConfig';
import { ApplicationError } from '../../error/Types';
import { INVALID_CUSTOMER } from '../customer/Errors';
import { CustomerModel } from '../customer/Model';
import { ICustomer } from '../customer/Types';
import { validateCustomer } from '../customer/Validation';
import {
  EMAIL_ALREADY_EXISTS,
  INVALID_LOGIN,
  UNAUTHORIZED_CUSTOMER,
} from './Errors';
import {
  comparePasswordHash,
  generateJWT,
  generatePasswordHash,
} from './Security';
import {
  CustomerJWTCustomer,
  CustomerLogin,
  ResponseCustomerLogin,
} from './Types';
import { validateCustomerAuthenticate } from './Validation';

export type FindByEmail = (email: string) => Promise<ICustomer>;

export interface IAuthService {
  authenticate(
    data: CustomerLogin,
    options?: BaseOptions
  ): Promise<[ResponseCustomerLogin, ApplicationError]>;
  checkAuthToken(
    token: string,
    options?: BaseOptions
  ): Promise<[ICustomer, ApplicationError]>;
  create(
    data: Partial<ICustomer>,
    options?: BaseOptions
  ): Promise<[ICustomer, ApplicationError]>;
}

export const AuthService = ({
  userModel = CustomerModel,
} = {}): Readonly<IAuthService> => {
  return {
    authenticate,
    checkAuthToken,
    create,
  };

  async function authenticate(
    data: CustomerLogin,
    { ctx }
  ): Promise<[ResponseCustomerLogin, ApplicationError]> {
    const [validatedData, err] = validateCustomerAuthenticate(data);

    if (err) {
      return [undefined, INVALID_LOGIN];
    }

    const { email, password } = validatedData;

    const res = await userModel.findOne({
      where: {
        email,
      },
      attributes: ['key', 'name', 'password', 'email'],
      logging: ctx?.log,
    });

    if (!res) {
      return [undefined, INVALID_LOGIN];
    }

    const matchPassword = await comparePasswordHash(password, res.password);

    if (matchPassword) {
      const jwtCustomer: CustomerJWTCustomer = {
        key: res.key,
        name: res.name,
        email: res.email,
      };
      const token: string = await generateJWT(jwtCustomer);

      return [{ success: true, token }, undefined];
    }

    return [undefined, INVALID_LOGIN];
  }

  async function create(
    data: Partial<ICustomer>,
    options?: BaseOptions
  ): Promise<[ICustomer, ApplicationError]> {
    const [validatedData, err] = validateCustomer(data);

    if (err) {
      return [undefined, INVALID_CUSTOMER(err.fields)];
    }

    const isEmailExists = await userModel.count({
      where: {
        email: validatedData.email,
      },
    });

    if (!!isEmailExists) {
      return [undefined, EMAIL_ALREADY_EXISTS()];
    }

    const created = await userModel.create(
      {
        ...validatedData,
        password: await generatePasswordHash(data.password),
      },
      {
        returning: true,
        logging: options?.ctx.log,
        transaction: options?.transaction,
      }
    );
    delete created?.password;

    return [created, undefined];
  }

  async function checkAuthToken(
    token: string,
    options?: BaseOptions
  ): Promise<[ICustomer, ApplicationError]> {
    const { ctx } = options || {};
    if (!token) {
      return [undefined, UNAUTHORIZED_CUSTOMER()];
    }
    try {
      const payload = jwt.decode(token, globalConfig.USER_JWT_SECRET);
      const exp = Number(payload?.exp);
      if (isNaN(exp) || exp < new Date().getTime()) {
        return [undefined, UNAUTHORIZED_CUSTOMER()];
      }

      const user = await userModel.findByPk(payload.user.key, {
        logging: ctx?.log,
      });

      if (!user) {
        return [undefined, UNAUTHORIZED_CUSTOMER()];
      }

      return [user, undefined];
    } catch (err) {
      return [undefined, UNAUTHORIZED_CUSTOMER()];
    }
  }
};
