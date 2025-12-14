
/**
 * Reporter levels (aligned with external services)
 */
export type ReporterLevel = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

/**
 * Context data sent to reporters
 */
export interface ReporterContext {
  component?: string;
  action?: string;
  userId?: string;
  address?: string;
  transactionHash?: string;
  amount?: number | string;
  [key: string]: unknown;
}

/**
 * Generic reporter interface
 * Can be implemented by Sentry, DataDog, LogRocket, etc.
 */
export interface Reporter {
  /**
   * Report an error with context
   */
  reportError(error: Error, context?: ReporterContext): void;

  /**
   * Report a message with level
   */
  reportMessage(
    message: string,
    level: ReporterLevel,
    context?: ReporterContext
  ): void;

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(
    message: string,
    level: ReporterLevel,
    context?: ReporterContext
  ): void;

  /**
   * Set user context (for tracking across events)
   */
  setUser?(userId: string, metadata?: Record<string, unknown>): void;

  /**
   * Clear user context
   */
  clearUser?(): void;
}
