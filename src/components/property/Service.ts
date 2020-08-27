import { BaseOptions } from '../../common/Types';
import { ApplicationError } from '../../error/Types';
import Sequelize from '../../sequelize/Sequelize';
import { CustomerModel } from '../customer/Model';
import { INVALID_PROPERTY } from './Errors';
import { PropertyModel } from './Model';
import { IProperty, IPropertyFilter } from './Types';
import { validateProperty } from './Validation';

export interface PropertyOptions extends BaseOptions {
  filter?: IPropertyFilter;
}

export interface PropertyCoordinates {
  latitude: number;
  longitude: number;
}

export interface IPropertyService {
  create(
    data: Partial<IProperty>,
    options?: BaseOptions
  ): Promise<[IProperty, ApplicationError]>;
  findAll(options?: PropertyOptions): Promise<[number, IProperty[]]>;
}

export const PropertyService = ({
  propertyModel = PropertyModel,
} = {}): Readonly<IPropertyService> => {
  return {
    create,
    findAll,
  };

  async function create(
    data: Partial<IProperty>,
    options?: BaseOptions
  ): Promise<[IProperty, ApplicationError]> {
    const [validatedData, err] = validateProperty(data);

    if (err) {
      return [undefined, INVALID_PROPERTY(err.fields)];
    }

    const created = await propertyModel.create(validatedData, {
      returning: true,
      logging: options?.ctx?.log,
    });

    return [created, undefined];
  }

  async function findAll(
    options?: PropertyOptions
  ): Promise<[number, IProperty[]]> {
    const { offset = 0, limit = 20, filter } = options || {};

    const { whereClause, includeClause } = getWhereClause(filter);

    const isValidList =
      (filter?.type && filter.type === 'list') ||
      !filter?.latitude ||
      !filter?.longitude;

    const shortByLatLong = `((ACOS(SIN(property.latitude * PI() / 180) * SIN(${filter?.latitude} * PI() / 180) + COS(property.latitude * PI() / 180) * COS(${filter?.latitude} * PI() / 180) * COS((property.longitude - ${filter?.longitude}) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) as distance`;

    const [count, results] = await Promise.all([
      propertyModel.count({
        where: whereClause,
        include: includeClause,
        logging: options?.ctx?.log,
      }),
      propertyModel.findAll({
        attributes: !isValidList
          ? [
              Sequelize.literal(shortByLatLong),
              'title',
              'latitude',
              'longitude',
              'key',
              'created_at',
            ]
          : undefined,
        where: whereClause,
        include: includeClause,
        logging: options?.ctx?.log,
        offset,
        limit,
        order: !isValidList
          ? Sequelize.literal('distance asc')
          : [['title', 'desc']],
      }),
    ]);

    return [count, results];
  }

  function getWhereClause(filter: IPropertyFilter) {
    return {
      whereClause: {
        ...(filter?.title && {
          title: {
            $iLike: `%${filter?.title}%`,
          },
        }),
      },
      includeClause: [
        {
          model: CustomerModel,
          required: !!(filter?.customer_name || filter?.customer_key),
          attributes: ['name', 'email', 'key'],
          where: {
            ...(filter?.customer_name && {
              name: {
                $iLike: `%${filter.customer_name}%`,
              },
            }),
            ...(filter?.customer_key && {
              key: filter?.customer_key,
            }),
          },
        },
      ],
    };
  }
};
