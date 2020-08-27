import { Sequelize } from 'sequelize-typescript';
import GlobaConfig from '../config/GlobalConfig';
import { addModels } from '../model/index';

const db = new Sequelize({
  host: GlobaConfig.SQL_HOST,
  database: GlobaConfig.SQL_DATABASE,
  username: GlobaConfig.SQL_USER,
  password: GlobaConfig.SQL_PASSWORD,
  port: GlobaConfig.SQL_PORT,
  dialect: 'postgres',
  pool: {
    handleDisconnects: true,
  },
  quoteIdentifiers: false,
  benchmark: true,
  logging: false,
} as any);

addModels(db);

export default db;
