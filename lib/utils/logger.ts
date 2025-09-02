import { format } from 'date-fns';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private static formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      level,
      message,
      context
    };
  }

  static info(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('info', message, context);
    console.log(JSON.stringify(entry));
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('warn', message, context);
    console.warn(JSON.stringify(entry));
  }

  static error(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('error', message, context);
    console.error(JSON.stringify(entry));
  }

  static debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('info', message, context);
    console.debug(JSON.stringify(entry));
  }
}