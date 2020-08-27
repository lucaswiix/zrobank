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
import { IProperty } from './Types';

@Table({
  modelName: 'property',
})
export class PropertyModel extends Model<PropertyModel> implements IProperty {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  key: string;

  @Column(DataType.TEXT)
  title: string;

  @Column(DataType.DOUBLE)
  latitude: number;

  @Column(DataType.DOUBLE)
  longitude: number;

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
}
