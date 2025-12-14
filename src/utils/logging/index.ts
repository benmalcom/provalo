
/**
 * Logging module
 *
 * Usage:
 *   import { logger } from '@/lib/logging';
 *   logger.info('Message', { component: 'MyComponent' });
 */

// Main logger exports
export { logger, Logger } from './logger';

// Type exports
export type { LogLevel, LogContext, LoggerConfig } from './types';

// Reporter exports
export { createReporter } from './reporters';
export type {
  Reporter,
  ReporterContext,
  ReporterLevel,
} from './reporters/reporter.interface';

// Reporter implementations (for custom usage)
export { SentryReporter, NoOpReporter } from './reporters';
