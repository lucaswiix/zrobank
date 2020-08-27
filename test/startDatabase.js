require('dotenv').config();

const shell = require('shelljs');
const childProcess = require('child_process');
const Sequelize = require('sequelize');
const sequelizeTypescript = require('sequelize-typescript');

const app = require('../src/index');
const { bepayConfig } = require('../dist/test/config');

const exec = (cmd) =>
  new Promise((resolve) => {
    childProcess.exec(cmd, { cwd: './' }, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error) return resolve(error);
      if (stderr) return resolve(stderr);
      return resolve(stdout);
    });
  });

const host = process.env.PG_HOST_TEST || '0.0.0.0';
const port = +(process.env.PG_PORT_TEST || 25432);

const migrationConf = {
  database: 'zrobank',
  user: 'zrobank',
  password: 'password',
  host,
  port,
  pool: {
    max: 1,
    min: 1,
    idle: 30000,
    acquire: 30000,
    evict: 30000,
    handleDisconnects: false,
  },
};

const dbConfig = {
  user: 'zrobank',
  port,
  password: 'password',
  database: 'zrobank',
  host,
  logging: false,
};

const dbConfigTS = new sequelizeTypescript.Sequelize({
  host,
  database: 'zrobank',
  username: 'zrobank',
  password: 'password',
  port,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 20,
    min: 1,
    idle: 30000,
    acquire: 30000,
    evict: 30000,
  },
  quoteIdentifiers: true,
  benchmark: true,
});

const DROP_QUERY = `
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO zrobank;
    GRANT ALL ON SCHEMA public TO public;
    CREATE EXTENSION unaccent;
`;

module.exports = async () => {
  if (process.env.SKIP_MIGRATION) {
    return;
  }

  const db = new Sequelize(
    migrationConf.database,
    migrationConf.user,
    migrationConf.password,
    {
      host: migrationConf.host,
      port: migrationConf.port,
      dialect: 'postgres',
      logging: false,
      pool: migrationConf.pool,
    }
  );

  await db.authenticate();

  console.log('Dropping schema...');
  await db.query(DROP_QUERY);

  shell.cd(process.env.PWD);

  console.log('Running migrations...');
  await exec(
    `${process.env.PWD}/bin/sql-migrate/run.sh up -config=${process.env.PWD}/dbconfig.yml -env='test'`
  );

  await app({ port: 60000, dbConfig, dbConfigTS, bepayConfig });
};
