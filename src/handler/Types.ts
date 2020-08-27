import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApplicationError } from '../error/Types';

export interface ResponseAPI<T = any, E = ApplicationError> {
  status: number;
  success: boolean;
  metadata?: ResponseMetadata;
  links?: any;
  data?: T;
  results?: T[];
  error?: E;
}

export interface ResponseMetadata {
  count: number;
  offset: number;
  limit: number;
  next?: string;
  previous?: string;
}

export interface Options extends AxiosRequestConfig {
  cacheControl?: string;
  axiosInstance?: AxiosInstance;
}
