
/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/**
 * Context attached to log messages
 */
export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  address?: string;
  transactionHash?: string;
  amount?: number | string;
  error?: Error | unknown;
  [key: string]: unknown;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  enableReporter?: boolean;
  enableConsoleInProduction?: boolean;
}
