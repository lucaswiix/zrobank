import { Sequelize } from 'sequelize-typescript';

export const db = new Sequelize({
  host: 'localhost',
  database: 'zrobank',
  username: 'zrobank',
  password: 'password',
  port: 25432,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 1,
    min: 1,
    idle: 30000,
    acquire: 30000,
    evict: 30000,
  },
  quoteIdentifiers: true,
  benchmark: true,
});

export const BEFORE_ALL_TIMEOUT = 10 * 1000;
export const DEFAULT_TIMEOUT = 30 * 1000;
