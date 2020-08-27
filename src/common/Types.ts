export type Limit = number;
export type Offset = number;
export type Count = number;

export interface Context {
  log: (...args: any[]) => void;
  error?: (...args: any[]) => void;
}

export interface BaseOptions {
  ctx: Context;
  transaction?: any;
  offset?: Offset;
  limit?: Limit;
}
