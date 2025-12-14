
import * as Sentry from '@sentry/nextjs';
import type {
  Reporter,
  ReporterLevel,
  ReporterContext,
} from './reporter.interface';

/**
 * Sentry implementation of the Reporter interface
 * Can be easily swapped with other services (LogRocket, DataDog, etc.)
 */
export class SentryReporter implements Reporter {
  private mapLevelToSentry(level: ReporterLevel): Sentry.SeverityLevel {
    switch (level) {
      case 'warning':
        return 'warning';
      case 'fatal':
        return 'fatal';
      default:
        return level as Sentry.SeverityLevel;
    }
  }

  reportError(error: Error, context?: ReporterContext): void {
    Sentry.captureException(error, {
      extra: context,
      tags: context?.component
        ? {
            component: context.component,
            action: context.action,
          }
        : undefined,
    });
  }

  reportMessage(
    message: string,
    level: ReporterLevel,
    context?: ReporterContext
  ): void {
    Sentry.captureMessage(message, {
      level: this.mapLevelToSentry(level),
      extra: context,
      tags: context?.component
        ? {
            component: context.component,
            action: context.action,
          }
        : undefined,
    });
  }

  addBreadcrumb(
    message: string,
    level: ReporterLevel,
    context?: ReporterContext
  ): void {
    Sentry.addBreadcrumb({
      message,
      level: this.mapLevelToSentry(level),
      data: context,
      timestamp: Date.now() / 1000,
    });
  }

  setUser(userId: string, metadata?: Record<string, unknown>): void {
    Sentry.setUser({
      id: userId,
      ...metadata,
    });
  }

  clearUser(): void {
    Sentry.setUser(null);
  }
}

/**
 * Helper to check if Sentry should be enabled
 */
export function shouldEnableSentry(): boolean {
  // Enable in production by default
  if (process.env.NODE_ENV === 'production') {
    return true;
  }

  // In development, check explicit flag
  return process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEV === 'true';
}
