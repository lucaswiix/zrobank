import express, { Router } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Context } from '../../common/Types';
import {
  authMiddlewares,
  defaultMiddlewares,
  optionsMiddleware,
} from '../../handler/Middlewares';
import { buildResponseData, buildResponseResults } from '../../handler/Utils';
import { ContextLoggerBuild } from '../../log/Logger';
import { RatingService } from '../rating/Service';
import { PropertyService } from './Service';

export function handler(): Router {
  const service = PropertyService();
  const ratingService = RatingService();
  const router = express.Router({ mergeParams: true });
  const middlewares = [
    ...defaultMiddlewares,
    optionsMiddleware,
    authMiddlewares(),
  ];
  const Logger = ContextLoggerBuild('PropertyHandler');

  router.post(
    '/',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = { log: Logger('POST /', res.locals.tid) };

        const data = req.body;

        const [result, err] = await service.create(
          {
            ...data,
            customer_key: res.locals.user.key,
          },
          { ctx }
        );

        const response = buildResponseData({
          status: 201,
          data: result,
          err,
        });

        res.status(response.status).json(response);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = { log: Logger('GET /', res.locals.tid) };

        const { offset, limit, ...filter } = req.query;

        const [count, results] = await service.findAll({
          filter: {
            ...filter,
            ...(filter?.type === 'map' && {
              latitude: res.locals.user.latitude,
              longitude: res.locals.user.longitude,
            }),
          },
          offset,
          limit,
          ctx,
        });

        const metadata = {
          count,
          offset,
          limit,
        };

        const response = buildResponseResults({
          status: 200,
          results,
          metadata,
        });

        res.status(response.status).json(response);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/:propertyKey/ratings',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = { log: Logger('GET /', res.locals.tid) };
        const { propertyKey } = req.params;
        const { offset, limit } = req.query;

        const [count, results] = await ratingService.findAll(propertyKey, {
          offset,
          limit,
          ctx,
        });

        const metadata = {
          count,
          offset,
          limit,
        };

        const response = buildResponseResults({
          status: 200,
          results,
          metadata,
        });

        res.status(response.status).json(response);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/:propertyKey/ratings',
    ...middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = { log: Logger('POST /', res.locals.tid) };

        const { propertyKey } = req.params;

        const data = req.body;

        const [result, err] = await ratingService.create(
          {
            ...data,
            customer_key: res.locals.user.key,
            property_key: propertyKey,
          },
          { ctx }
        );

        const response = buildResponseData({
          status: 201,
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
