import { addMinutes } from 'date-fns';
import jwt from 'jwt-simple';
import uuid from 'uuid';
import { Context } from '../../common/Types';
import globalConfig from '../../config/GlobalConfig';
import { ErrorCodes } from '../../error/Types';
import { ContextLoggerBuild } from '../../log/Logger';
import { CustomerErrorCode } from '../customer/Errors';
import { CustomerSeed } from '../customer/Seed';
import { AuthErrorCode } from './Errors';
import { generateJWT } from './Security';
import { AuthService } from './Service';

const Logger = ContextLoggerBuild('Auth Service Test');

const ctx: Context = {
  log: Logger('Test AuthService /', uuid.v1()),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('AuthService', () => {
  const fnFindOne = jest.fn((opts) =>
    Promise.resolve(
      CustomerSeed.data.find((user) => user.email === opts?.where?.email) ||
        undefined
    )
  );
  const fnFindByPk = jest.fn((key, ops) =>
    Promise.resolve(
      CustomerSeed.data.find((user) => user.key === key) || undefined
    )
  );

  const fnCreate = jest.fn((data, options) =>
    Promise.resolve(CustomerSeed.data[0])
  );
  const fnCount = jest.fn((data) =>
    Promise.resolve(
      CustomerSeed.data.find((user) => user.email === data?.where?.email) ||
        undefined
    )
  );

  const mockedCustomerModel = {
    findOne: fnFindOne,
    findByPk: fnFindByPk,
    create: fnCreate,
    count: fnCount,
  };
  const mockedAuthService = AuthService({
    userModel: mockedCustomerModel as any,
  });
  describe('authenticate', () => {
    const password = 'abc123';
    it('should authenticate user correctly with email and password', async () => {
      const [login, error] = await mockedAuthService.authenticate(
        {
          email: CustomerSeed.data[0].email,
          password: 'abc123',
        },
        { ctx }
      );

      expect(error).toBeUndefined();
      expect(login.success).toEqual(true);
      expect(login.token).toBeDefined();
      expect(login).toBeDefined();
      expect(fnFindOne).toBeCalled();
      expect(fnFindOne.mock.calls[0][0]?.where?.email).toBe(
        CustomerSeed.data[0].email
      );
    });

    it('should not authenticate Customer (email not found)', async () => {
      const emailNotExist = 'non-existing_email../../livehere.com.br';
      const [login, error] = await mockedAuthService.authenticate(
        {
          email: emailNotExist,
          password,
        },
        { ctx }
      );

      expect(login).toBeUndefined();
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
      expect(fnFindOne).toBeCalled();
      expect(fnFindOne.mock.calls[0][0]?.where?.email).toBe(emailNotExist);
    });

    it('should not authenticate Customer (wrong password)', async () => {
      const [login, error] = await mockedAuthService.authenticate(
        {
          email: CustomerSeed.data[0].email,
          password: 'wrongpassword',
        },
        { ctx }
      );

      expect(login).toBeUndefined();
      expect(error).toBeDefined();
      expect(error.status).toBe(401);

      expect(fnFindOne).toBeCalled();
      expect(fnFindOne.mock.calls[0][0]?.where?.email).toBe(
        CustomerSeed.data[0].email
      );
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const validEmail = 'lucasrocha@zrobank.com';
      const [created, error] = await mockedAuthService.create({
        ...CustomerSeed.data[0],
        email: validEmail,
      });

      delete CustomerSeed.data[0].password;

      expect(error).toBeUndefined();
      expect(created).toBeDefined();
      expect(created).toEqual(CustomerSeed.data[0]);
      expect(fnCount).toBeCalled();
      expect(fnCount.mock.calls[0][0]?.where?.email).toBe(validEmail);

      expect(fnCreate).toBeCalledTimes(1);
      expect(Object.keys(fnCreate.mock.calls[0][0]).sort()).toMatchObject(
        ['email', 'password', 'name', 'key'].sort()
      );
    });

    it('should not create user with invalid email', async () => {
      const [created, error] = await mockedAuthService.create({
        ...CustomerSeed.data[0],
        email: 'asd1233123',
        password: '123456',
      });

      expect(error).toBeDefined();
      expect(error.code).toBe(
        ErrorCodes.USER_PREFIX + CustomerErrorCode.INVALID_USER
      );
      expect(error.fields.some((field) => field.property === 'email')).toBe(
        true
      );
      expect(fnCreate).not.toBeCalled();
      expect(created).toBeUndefined();
    });
    it('should not create user with small password', async () => {
      const [created, error] = await mockedAuthService.create({
        ...CustomerSeed.data[0],
        email: 'lucas@zrobank.com.br',
        password: '123',
      });

      expect(error).toBeDefined();
      expect(error.code).toBe(
        ErrorCodes.USER_PREFIX + CustomerErrorCode.INVALID_USER
      );
      expect(error.fields.some((field) => field.property === 'password')).toBe(
        true
      );
      expect(fnCreate).not.toBeCalled();
      expect(created).toBeUndefined();
    });

    it('should not create user with email already registred', async () => {
      const [created, error] = await mockedAuthService.create({
        ...CustomerSeed.data[0],
        password: '12345678',
      });

      expect(error).toBeDefined();
      expect(error.code).toBe(
        ErrorCodes.USER_PREFIX + AuthErrorCode.USER_EMAIL_ALREADY_EXISTS
      );
      expect(fnCount).toBeCalled();
      expect(fnCreate).not.toBeCalled();
      expect(created).toBeUndefined();
    });
  });

  describe('checkAuthToken', () => {
    it('should check token successfully and return a user', async () => {
      const generateJwt = await generateJWT({
        email: CustomerSeed.data[0].email,
        name: CustomerSeed.data[0].name,
        key: CustomerSeed.data[0].key,
      });
      const [user, error] = await mockedAuthService.checkAuthToken(
        generateJwt,
        { ctx }
      );
      expect(error).toBeUndefined();
      expect(fnFindByPk).toBeCalled();
      expect(user).toBeDefined();
      expect(user.email).toBe(CustomerSeed.data[0].email);
    });

    it('should failed in the verification token because the key not exist', async () => {
      const data = {
        exp: addMinutes(
          new Date(),
          globalConfig.USER_JWT_EXPIRATION_TIME
        ).getTime(),
        user: {
          email: CustomerSeed.data[0].email,
          name: CustomerSeed.data[0].name,
          key: '312312',
        },
      };

      const token = await jwt.encode(data, globalConfig.USER_JWT_SECRET);

      const [user, error] = await mockedAuthService.checkAuthToken(token, {
        ctx,
      });
      expect(user).toBeUndefined();
      expect(error).toBeDefined();
      expect(fnFindByPk).toBeCalled();
      expect(error.code).toBe(
        ErrorCodes.USER_PREFIX + AuthErrorCode.UNAUTHORIZED_USER
      );
    });
    it('should failed in the token verification because the time has expired', async () => {
      const data = {
        exp: addMinutes(new Date(), -1).getTime(),
        user: {
          email: CustomerSeed.data[0].email,
          name: CustomerSeed.data[0].name,
          key: CustomerSeed.data[0].key,
        },
      };

      const token = await jwt.encode(data, globalConfig.USER_JWT_SECRET);

      const [user, error] = await mockedAuthService.checkAuthToken(token, {
        ctx,
      });
      expect(user).toBeUndefined();
      expect(error).toBeDefined();
      expect(fnFindByPk).not.toBeCalled();
      expect(error.code).toBe(
        ErrorCodes.USER_PREFIX + AuthErrorCode.UNAUTHORIZED_USER
      );
    });
  });
});
