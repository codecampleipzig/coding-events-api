const execa = require('execa');
const fs = require('fs');
const path = require('path');
const process = require('process');

let testAppProcess = null;

async function startTestApp() {
  if (testAppProcess) return;

  fs.unlinkSync(path.resolve(process.cwd(), '.tmp', 'test-data.db'));
  testAppProcess = execa('strapi', ['develop', '--no-build'], {
    env: {
      'NODE.ENV': 'test',
      'BROWSER': 'null'
    },
  });

  return new Promise(resolve => {
    testAppProcess.stdout.on('data', data => {
      if (String(data).includes('http://')) {
        resolve();
      }
    });
  });
}

async function stopTestApp() {
  if (!testAppProcess) return;

  testAppProcess.cancel();
  try {
    await testAppProcess;
  }
  // eslint-disable-next-line no-empty
  catch {
  }
}

module.exports = {
  startTestApp,
  stopTestApp,
};