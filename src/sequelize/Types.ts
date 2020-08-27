import { Model } from 'sequelize-typescript';

export interface SequelizeError<M extends Model<M>> {
  name: string;
  fields: Partial<M>;
  errors: Array<{
    message: string;
    type: string;
    path: string;
    value: any;
    origin: string;
    instance: Partial<M>;
    validatorKey: string;
    validatorName: string;
    validatorArgs: any[];
  }>;
}

export enum SequelizeErrorName {
  UNIQUE_CONSTRAINT_ERROR = 'SequelizeUniqueConstraintError',
}
