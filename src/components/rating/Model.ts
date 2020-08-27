import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CustomerModel } from '../customer/Model';
import { ICustomer } from '../customer/Types';
import { PropertyModel } from '../property/Model';
import { IProperty } from '../property/Types';
import { IRating } from './Types';
@Table({
  modelName: 'rating',
})
export class RatingModel extends Model<RatingModel> implements IRating {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  key: string;

  @Column(DataType.BIGINT)
  property_key: string;

  @Column(DataType.SMALLINT)
  rating: number;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.BIGINT)
  customer_key: string;

  @CreatedAt
  @Column(DataType.TIME)
  created_at: string;

  @UpdatedAt
  @Column(DataType.TIME)
  updated_at: string;

  @BelongsTo(() => CustomerModel, 'customer_key')
  customer: ICustomer;

  @BelongsTo(() => PropertyModel, 'property_key')
  property: IProperty;
}
