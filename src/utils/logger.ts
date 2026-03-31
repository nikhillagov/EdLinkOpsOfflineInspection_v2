/**
 * Logger utility for consistent application logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  error?: any;
}

class Logger {
  private module: string;
  private logStorage: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(module: string) {
    this.module = module;
  }

  private formatTime(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, error?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTime(),
      level,
      module: this.module,
      message,
      error
    };

    // Store in memory
    this.logStorage.push(entry);
    if (this.logStorage.length > this.maxLogs) {
      this.logStorage.shift();
    }

    // Console output
    const prefix = `[${entry.timestamp}] ${level.toUpperCase()} [${this.module}]`;
    switch (level) {
      case 'debug':
        if (import.meta.env.DEV) console.debug(prefix, message, error);
        break;
      case 'info':
        console.info(prefix, message, error);
        break;
      case 'warn':
        console.warn(prefix, message, error);
        break;
      case 'error':
        console.error(prefix, message, error);
        break;
    }
  }

  debug(message: string, error?: any): void {
    this.log('debug', message, error);
  }

  info(message: string, error?: any): void {
    this.log('info', message, error);
  }

  warn(message: string, error?: any): void {
    this.log('warn', message, error);
  }

  error(message: string, error?: any): void {
    this.log('error', message, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logStorage];
  }

  clearLogs(): void {
    this.logStorage = [];
  }
}

export const createLogger = (module: string): Logger => {
  return new Logger(module);
};

export type { LogLevel, LogEntry };
