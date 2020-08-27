import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express-serve-static-core';
import { AuthService } from '../components/auth/Service';
import { ResponseAPI } from './Types';
import { buildResponseData } from './Utils';

export const ErrorLogger =
  typeof process.env.NDD_PPID === 'undefined' ? debug('ERROR') : console.error;

const errorResponse: Partial<ResponseAPI> = Object.freeze({
  status: 500,
  success: false,
});

export const defaultMiddlewares = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json({ limit: '100mb' }),
  cookieParser(),
  bodyParser.json({ type: 'application/vnd.api+json' }),
] as RequestHandler[];

export const optionsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin ? String(req.headers.origin) : '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, DELETE, PUT, PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Authorization, X-Requested-With, Content-Type, Accept, Charset, X-Auth-Token'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
};

export const authMiddlewares = (authService = AuthService()) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req?.cookies?.zrobank_access_token_auth;
    console.log('authtoken', authToken);
    const [user, err] = await authService.checkAuthToken(authToken);
    if (err) {
      const response = buildResponseData({ status: err.status, err });
      res.status(response.status).json(response);
      return;
    }
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};

export const errorHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ErrorLogger('%s %o', res.locals.tid, err);
  res.status(500).json({
    ...errorResponse,
    ...(String(req.path).includes('/restrict') && {
      error: err,
    }),
  });
};
