import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';
import dotenv from 'dotenv';
import * as path from 'path';

// TODO: When everything is centered here, the dotenv will only be used here
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

if (process.env.NODE_ENV === 'test') {
  Object.assign(process.env, {
    SQL_PORT: '25432',
    SQL_USER: 'zrobank',
    SQL_DATABASE: 'zrobank',
    SQL_PASSWORD: 'password',
    SQL_HOST: 'localhost',
    USER_JWT_SECRET: 'zrosecret',
    USER_JWT_EXPIRATION_TIME: 20160,
    USER_AUTH_JWT_SECRET: 'authsecret',
  });
}

export interface IGlobalConfig {
  /* Application */
  NODE_ENV: 'production' | 'homologation' | 'development' | 'test';
  DEBUG: string;
  PORT: number;
  APP_HOST: string;
  HOST: string;

  /* Database */
  SQL_USER: string;
  SQL_PASSWORD: string;
  SQL_DATABASE: string;
  SQL_HOST: string;
  SQL_PORT: string;

  USER_JWT_SECRET: string;
  USER_JWT_EXPIRATION_TIME: number;
  USER_AUTH_JWT_SECRET: string;
}

class GlobalConfigValidator implements IGlobalConfig {
  @IsNotEmpty()
  @IsString()
  NODE_ENV: 'production' | 'homologation' | 'development' | 'test';

  DEBUG: string;
  APP_HOST: string;

  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  HOST: string;

  @IsNotEmpty()
  @IsString()
  SQL_USER: string;

  @IsNotEmpty()
  @IsString()
  SQL_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  SQL_DATABASE: string;

  @IsNotEmpty()
  @IsString()
  SQL_HOST: string;

  @IsNotEmpty()
  @IsString()
  SQL_PORT: string;

  @IsNotEmpty()
  @IsString()
  USER_JWT_SECRET: string;

  @IsNumberString()
  @IsNotEmpty()
  USER_JWT_EXPIRATION_TIME: number;

  @IsNotEmpty()
  @IsString()
  USER_AUTH_JWT_SECRET: string;
}

const globalConfig = buildGlobalConfig();
export default globalConfig;

export function buildGlobalConfig({
  optionalConf = null,
  throwErr = false,
} = {}) {
  const validator = new GlobalConfigValidator();
  const baseConf = {
    ...optionalConf,
    ...process.env,
  };
  const conf: Readonly<IGlobalConfig> = Object.freeze({
    ...baseConf,
    NODE_ENV: String(baseConf.NODE_ENV).toLowerCase(),
    PORT: Number(baseConf.PORT),
  });
  Object.assign(validator, conf);

  const errors = validateSync(validator, { forbidUnknownValues: false });
  if (errors.length) {
    const errListFmt = errors.map(({ property, constraints }) => ({
      property,
      constraints,
    }));
    const err = Error(JSON.stringify(errListFmt));
    if (throwErr) {
      throw err;
    } else {
      console.warn(err);
    }
  }
  return conf;
}
