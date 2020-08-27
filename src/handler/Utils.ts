import { get as _get } from 'lodash';
import { BaseOptions } from '../common/Types';
import { ApplicationError } from '../error/Types';
import { ResponseAPI, ResponseMetadata } from './Types';

export const PAGE_SIZE = 25;

export interface IBuildResponseDataInput<T, E extends ApplicationError> {
  status: number;
  data?: T;
  err?: E;
}

export interface IBuildResponseResultsInput<T, E extends ApplicationError> {
  status: number;
  results: T[];
  metadata: ResponseMetadata;
  err?: E;
}

export function buildResponseData<T, E extends ApplicationError>(
  responseData: IBuildResponseDataInput<T, E>
): ResponseAPI<T, E> {
  const { status = 500, data, err } = responseData;
  return err
    ? {
        status: err.status || 500,
        success: false,
        error: err,
      }
    : {
        status,
        success: true,
        ...{ data },
      };
}

export function buildResponseResults<T, E extends ApplicationError>(
  responseData: IBuildResponseResultsInput<T, E>
): ResponseAPI<T, E> {
  const { status = 500, results, metadata, err } = responseData;

  return err
    ? {
        status: err.status || 500,
        success: false,
        error: err,
      }
    : {
        status,
        success: true,
        results,
        metadata,
      };
}

export async function handleAxiosResponse(
  fn: () => Promise<any>
): Promise<ResponseAPI<any, any>> {
  try {
    return await fn();
  } catch (err) {
    if (err?.response?.data?.status) {
      return err.response.data;
    }

    return {
      status: err.response.status,
      success: false,
      data: err.response.data,
      error: err,
    };
  }
}

export interface IPagination {
  offset: number;
  limit: number;
}

export const getOptions = (options) => {
  return options && options.filter
    ? options
    : {
        filter: {},
      };
};

export function getPagination(options?: BaseOptions): IPagination {
  const offset = Number(_get(options, 'offset')) || 0;
  const limit = Number(_get(options, 'limit')) || PAGE_SIZE;
  return {
    offset,
    limit,
  };
}
