import express, { Router } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Context } from '../../common/Types';
import {
  defaultMiddlewares,
  optionsMiddleware,
} from '../../handler/Middlewares';
import { buildResponseData } from '../../handler/Utils';
import { ContextLoggerBuild } from '../../log/Logger';
import { AuthService } from './Service';

export function handler(): Router {
  const service = AuthService();
  const router = express.Router({
    mergeParams: true,
  });
  const middlewares = [...defaultMiddlewares, optionsMiddleware];
  const Logger = ContextLoggerBuild('AuthHandler');

  router.post(
    '/login',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = {
          log: Logger('POST /login', res.locals.tid),
        };

        const data = req.body;

        const [result, err] = await service.authenticate(data, {
          ctx,
        });

        const response = buildResponseData({
          status: 200,
          data: result,
          err,
        });

        res.status(response.status).json(response);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/register',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = {
          log: Logger('POST /register', res.locals.tid),
        };

        const data = req.body;

        const [result, err] = await service.create(data, {
          ctx,
        });

        const response = buildResponseData({
          status: 200,
          data: result,
          err,
        });

        res.status(response.status).json(response);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
