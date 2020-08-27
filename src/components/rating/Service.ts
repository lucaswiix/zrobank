import { IIncludeOptions } from 'sequelize-typescript';
import { IWhereOptions } from 'sequelize-typescript/lib/interfaces/IWhereOptions';
import { BaseOptions } from '../../common/Types';
import { ApplicationError } from '../../error/Types';
import { CustomerModel } from '../customer/Model';
import { PropertyModel } from '../property/Model';
import { INVALID_RATING, PROPERTY_NOT_FOUND_TO_RATING } from './Errors';
import { RatingModel } from './Model';
import { IRating } from './Types';
import { validateRating } from './Validation';

export interface IRatingService {
  create(
    data: Partial<IRating>,
    options?: BaseOptions
  ): Promise<[IRating, ApplicationError]>;
  findAll(
    propertyKey: string,
    options?: BaseOptions
  ): Promise<[number, IRating[]]>;
}

export const RatingService = ({
  ratingModel = RatingModel,
  propertyModel = PropertyModel,
} = {}): Readonly<IRatingService> => {
  return {
    create,
    findAll,
  };

  async function create(
    data: Partial<IRating>,
    options?: BaseOptions
  ): Promise<[IRating, ApplicationError]> {
    const [validatedData, err] = validateRating(data);

    if (err) {
      return [undefined, INVALID_RATING(err.fields)];
    }

    const property = await propertyModel.findByPk(data.property_key);

    if (!property) {
      return [undefined, PROPERTY_NOT_FOUND_TO_RATING(data.property_key)];
    }

    const created = await ratingModel.create(validatedData, {
      returning: true,
      logging: options?.ctx?.log,
    });

    return [created, undefined];
  }

  async function findAll(
    propertyKey: string,
    options?: BaseOptions
  ): Promise<[number, IRating[]]> {
    const { offset = 0, limit = 20 } = options || {};

    const [whereClause, includeClause] = whereAndIncluseClause(propertyKey);

    const [count, results] = await Promise.all([
      ratingModel.count({
        where: whereClause,
        include: includeClause,
        logging: options?.ctx?.log,
      }),
      ratingModel.findAll({
        where: whereClause,
        include: includeClause,
        logging: options?.ctx?.log,
        offset,
        limit,
        order: [['created_at', 'desc']],
      }),
    ]);

    return [count, results];
  }

  function whereAndIncluseClause(
    propertyKey
  ): [IWhereOptions<RatingModel>, IIncludeOptions[]] {
    return [
      {
        property_key: propertyKey,
      },
      [
        {
          model: CustomerModel,
        },
        {
          model: PropertyModel,
        },
      ],
    ];
  }
};
