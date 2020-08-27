export type UUID = string;
export type datetimezone = string; // 2019-02-19T18:21:13.902-03:00

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export const GenderLabel = {
  [Gender.MALE]: 'Masculino',
  [Gender.FEMALE]: 'Feminino',
  [Gender.OTHER]: 'Outro',
};

export enum MaritalStatus {
  SINGLE = 2,
  MARRIED = 3,
  WIDOWED = 4,
  DIVORCED = 5,
}

export const MaritalStatusLabel = {
  [MaritalStatus.SINGLE]: 'Solteiro',
  [MaritalStatus.MARRIED]: 'Casado',
  [MaritalStatus.WIDOWED]: 'Viúvo',
  [MaritalStatus.DIVORCED]: 'Divorciado',
};

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
