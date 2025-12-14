import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    await import('./sentry.edge.config');
  }
}

// Required hook for capturing request errors from nested React Server Components
export const onRequestError = Sentry.captureRequestError;
