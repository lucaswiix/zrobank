import childProcess from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test';

const DROP_QUERY = `
    DROP SCHEMA IF EXISTS public CASCADE;    
    CREATE SCHEMA public;
    GRANT USAGE ON SCHEMA public TO zrobank;
    GRANT ALL ON SCHEMA public TO zrobank;
`;

module.exports = async () => {
  console.time('setup');
  await Promise.all([runMigrations(), appInitialization()]);
  if (process.send) {
    process.send('jest-setup-done');
  }
  console.timeEnd('setup');
};

async function runMigrations() {
  console.time('migrations');

  let Seeds;

  const { Sequelize } = require('sequelize-typescript');

  const db = new Sequelize({
    host: 'localhost',
    database: 'zrobank',
    username: 'postgres',
    password: 'password',
    port: 25432,
    dialect: 'postgres',
    pool: {
      max: 20,
      min: 1,
      idle: 30000,
      acquire: 30000,
      evict: 30000,
    },
    quoteIdentifiers: false,
    benchmark: true,
  });
  await Promise.all([
    db.query(DROP_QUERY, { logging: false }),
    (async () => {
      require('shelljs').cd(process.env.PWD);
      require('../model').addModels(db);
      Seeds = require('./exports').default;
    })(),
  ]);

  console.log('Running migrations...');
  await exec(
    `yarn run sqlmigrate up -config=${process.env.PWD}/dbconfig.yml -env="test"`
  );
  for (const seed of Seeds as any[]) {
    try {
      await seed.model.bulkCreate(seed.data, { logging: false });
    } catch (e) {
      console.error(seed.data);
      console.log(e);
    }
  }

  console.timeEnd('migrations');
}

async function appInitialization() {
  console.time('app');

  const { PORT } = require('./config');
  await exec(`kill -9 $(lsof -t -i:${PORT})`);
  const { initApp } = require('../app');
  await initApp({ port: PORT });

  console.timeEnd('app');
}

if (require.main === module) {
  module.exports();
}

function exec(cmd) {
  return new Promise((resolve) => {
    childProcess.exec(cmd, { cwd: './' }, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error) {
        return resolve(error);
      }
      if (stderr) {
        return resolve(stderr);
      }
      return resolve(stdout);
    });
  });
}
