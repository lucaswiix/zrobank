import debug from 'debug';

export const ErrorLogger =
  typeof process.env.NDD_PPID === 'undefined' ? debug('ERROR') : console.error;

export const DebugLogger =
  typeof process.env.NDD_PPID === 'undefined' ? debug('DEBUG') : console.log;

export const ServiceLogger = (service) => (tid: string) => (
  method: string,
  ...args: any[]
) =>
  DebugLogger(
    `${new Date().toISOString()} ${tid} ${service} ${method} ${'%o '.repeat(
      (args || []).length
    )}`,
    ...args
  );

export const LoggerMid = (tid: string) => (method: string, ...args: any[]) =>
  DebugLogger(
    `${new Date().toISOString()} ${tid}   ${method} ${'%o '.repeat(
      (args || []).length
    )}`,
    ...args
  );

export const ContextLoggerBuild = (callerId: string) => (
  action: string,
  transactionId: string
) => (logTxt: string, ...args: any[]) =>
  DebugLogger(`TID=${transactionId} ${callerId} ${action} ${logTxt}`, ...args);
