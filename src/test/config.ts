import { Sequelize } from 'sequelize-typescript';

export const BEFORE_ALL_TIMEOUT = 10 * 1000;
export const DEFAULT_TIMEOUT = 300 * 1000;

export const PORT = 63000;
export const API_URL = `http://127.0.0.1:${PORT}`;

export const db = new Sequelize({
  host: 'localhost',
  database: 'zrobank',
  username: 'zrobank',
  password: 'password',
  port: 25432,
  dialect: 'postgres',
  logging: true,
  pool: {
    max: 3,
    min: 1,
    idle: 30000,
    acquire: 30000,
    evict: 30000,
  },
  quoteIdentifiers: true,
  benchmark: true,
});
