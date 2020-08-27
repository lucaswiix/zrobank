import zrobank from 'commander';
import * as path from 'path';

const envConfigFilePath = path.resolve(
  __dirname,
  '..',
  process.env.ENV_FILE_PATH || '.env'
);
const googleCloudKeyFilePath = path.resolve(
  __dirname,
  '..',
  'credentials',
  '4dbff50adff5.json'
);

(async () => {
  require('dotenv').config({ path: envConfigFilePath });

  const app = () => require('./app').default();

  zrobank.version('v0.1.0');

  // Main command, Web Application
  zrobank.command('dev').action(() => {
    app();
  });

  // Main command, Web Application
  zrobank.command('app').action(app);

  zrobank.on('command:*', () => {
    console.error('Invalid command');
    process.exit(1);
  });

  zrobank.parse(process.argv);
})();
