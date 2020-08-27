import { ICustomer } from '../customer/Types';

export interface IProperty {
  key: string;
  customer_key: string;
  title: string;
  latitude: number;
  longitude: number;
  customer: ICustomer;
  created_at: string;
  updated_at: string;
}

export interface IPropertyFilter {
  title?: string;
  customer_name?: string;
  customer_key?: string;
  type?: IPropertySearchType;
  latitude?: number;
  longitude?: number;
}

export type IPropertySearchType = 'list' | 'map';
