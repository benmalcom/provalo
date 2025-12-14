'use client';

import type { Reporter, ReporterLevel } from '@/utils/logging/reporters';
import { createReporter } from './reporters';
import type { LogLevel, LogContext, LoggerConfig } from './types';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private reporter: Reporter;
  private enableConsoleInProduction: boolean;

  constructor(config: LoggerConfig = {}) {
    this.reporter = createReporter(config.enableReporter);
    this.enableConsoleInProduction = config.enableConsoleInProduction ?? false;

    if (this.isDevelopment) {
      console.log('Logger initialized:', {
        reporter: config.enableReporter ? 'enabled' : 'disabled',
        environment: process.env.NODE_ENV,
      });
    }

    // Global error handlers (browser only)
    if (typeof window !== 'undefined') {
      window.addEventListener('error', event => {
        this.error('Unhandled error', {
          component: 'Global',
          error: event.error,
          message: event.message,
        });
      });

      window.addEventListener('unhandledrejection', event => {
        this.error('Unhandled promise rejection', {
          component: 'Global',
          error: event.reason,
        });
      });
    }
  }

  private getEmoji(level: LogLevel): string {
    const emojis = {
      debug: '🐛',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      critical: '🚨',
    };
    return emojis[level];
  }

  private shouldLogToConsole(): boolean {
    if (this.isDevelopment) return true;
    return this.enableConsoleInProduction;
  }

  private mapLogLevelToReporter(level: LogLevel): ReporterLevel {
    if (level === 'warn') return 'warning';
    if (level === 'critical') return 'fatal';
    return level as ReporterLevel;
  }

  private sanitizeContext(context?: LogContext) {
    if (!context) return {};

    const sanitized = { ...context };

    // Shorten addresses
    if (sanitized.address && sanitized.address.length > 16) {
      sanitized.address = `${sanitized.address.slice(0, 6)}...${sanitized.address.slice(-4)}`;
    }

    // Remove sensitive data
    const sensitiveKeys = [
      'privateKey',
      'mnemonic',
      'seed',
      'password',
      'secret',
    ];
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        delete sanitized[key];
      }
    });

    // Remove error object from context (will be handled separately)
    const restContext = { ...sanitized };
    delete restContext.error;

    return restContext;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const emoji = this.getEmoji(level);
    const component = context?.component ? `[${context.component}]` : '';
    const formattedMessage = `${emoji} ${component} ${message}`;

    // Console logging
    if (this.shouldLogToConsole()) {
      const logFn =
        level === 'warn' || level === 'error' || level === 'critical'
          ? console.error
          : console.log;

      if (context) {
        logFn(formattedMessage, context);
      } else {
        logFn(formattedMessage);
      }
    }

    // Report to external service (Sentry, etc.)
    const shouldReport = ['warn', 'error', 'critical'].includes(level);
    if (shouldReport) {
      const sanitized = this.sanitizeContext(context);
      const reporterLevel = this.mapLogLevelToReporter(level);

      if (context?.error instanceof Error) {
        this.reporter.reportError(context.error, sanitized);
      } else {
        this.reporter.reportMessage(message, reporterLevel, sanitized);
      }
    }

    // Always add breadcrumb for context
    this.reporter.addBreadcrumb(
      message,
      this.mapLogLevelToReporter(level),
      this.sanitizeContext(context)
    );
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  critical(message: string, context?: LogContext): void {
    this.log('critical', message, context);
  }

  // User tracking
  setUser(userId: string, metadata?: Record<string, unknown>): void {
    this.reporter.setUser?.(userId, metadata);
  }

  clearUser(): void {
    this.reporter.clearUser?.();
  }
}

// Export singleton with default config
export const logger = new Logger();

// Export class for custom instances
export { Logger };
