import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ICustomer } from './Types';
@Table({
  modelName: 'customer',
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
})
export class CustomerModel extends Model<CustomerModel> implements ICustomer {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  key: string;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  password: string;

  @CreatedAt
  @Column(DataType.TIME)
  created_at: string;

  @UpdatedAt
  @Column(DataType.TIME)
  updated_at: string;
}
