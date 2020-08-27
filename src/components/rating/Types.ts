import { ICustomer } from '../customer/Types';
import { IProperty } from '../property/Types';

export interface IRating {
  key: string;
  property_key: string;
  customer_key: string;
  rating: number;
  description: string;
  created_at: string;
  updated_at: string;

  property: IProperty;
  customer: ICustomer;
}
