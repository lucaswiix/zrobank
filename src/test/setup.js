require('dotenv').config();
const { spawn } = require('child_process');

module.exports = () => new Promise((resolve, reject) => {
  if (process.env.SKIP_MIGRATION) {
    resolve();
    return;
  }

  try {
    const spawned = spawn('node', ['-r', 'ts-node/register/transpile-only', 'src/test/setup.ts'], {
      stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
    });
    process.on('exit', () => {
      process.kill(spawned.pid);
    });

    spawned.on('close', resolve);
    spawned.on('message', (data) => {
      if (data === 'jest-setup-done') {
        resolve();
      }
    });
    spawned.on('error', reject);
  } catch (e) {
    reject(e);
  }
});

if (require.main === module) {
  module.exports();
}
