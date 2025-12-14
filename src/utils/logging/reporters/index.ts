
// Export types and interfaces
export type {
  Reporter,
  ReporterContext,
  ReporterLevel,
} from './reporter.interface';

// Export reporter implementations
export { SentryReporter, shouldEnableSentry } from './sentry';
export { NoOpReporter } from './noop';

// Reporter factory
import type { Reporter } from './reporter.interface';
import { SentryReporter, shouldEnableSentry } from './sentry';
import { NoOpReporter } from './noop';

/**
 * Create reporter based on environment
 * Defaults to Sentry in production, NoOp in development
 */
export function createReporter(enableSentry?: boolean): Reporter {
  const shouldEnable = enableSentry ?? shouldEnableSentry();

  if (shouldEnable) {
    return new SentryReporter();
  }

  return new NoOpReporter();
}
