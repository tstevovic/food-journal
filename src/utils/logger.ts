import { config } from '@/config/config';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = this.getLogLevel(config.logging.level);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  }

  public error(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message, meta));
    }
  }

  public warn(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  public info(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', message, meta));
    }
  }

  public debug(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, meta));
    }
  }
}

export const logger = Logger.getInstance();
