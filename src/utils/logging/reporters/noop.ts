
import type {
  Reporter,
  ReporterLevel,
  ReporterContext,
} from './reporter.interface';

/**
 * No-op reporter for development or when reporting is disabled
 * All methods do nothing
 */
export class NoOpReporter implements Reporter {
  reportError(_error: Error, _context?: ReporterContext): void {
    // Do nothing
  }

  reportMessage(
    _message: string,
    _level: ReporterLevel,
    _context?: ReporterContext
  ): void {
    // Do nothing
  }

  addBreadcrumb(
    _message: string,
    _level: ReporterLevel,
    _context?: ReporterContext
  ): void {
    // Do nothing
  }

  setUser(_userId: string, _metadata?: Record<string, unknown>): void {
    // Do nothing
  }

  clearUser(): void {
    // Do nothing
  }
}
