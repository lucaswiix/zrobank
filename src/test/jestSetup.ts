jest.setTimeout(30 * 1000);

if (typeof process.env.ENABLE_JEST_LOG === 'undefined') {
  jest.spyOn(global.console, 'debug').mockImplementation(() => jest.fn());
  jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());
  jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
  jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());
  jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
}

