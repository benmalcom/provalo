import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Environment and release
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // Enable in production by default, configurable in development
  enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEV === 'true',

  // Updated integrations for newer Sentry versions
  integrations: [
    Sentry.browserTracingIntegration({
      // Automatically instruments Next.js routing
    }),
    Sentry.replayIntegration({
      // Session replay configuration
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Session replay sampling
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Initial scope for your trading app
  initialScope: {
    tags: {
      component: 'splash-trading-app',
      platform: 'browser',
    },
    extra: {
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
      sha: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
  },

  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEV !== 'true') {
      console.log('Sentry event (dev mode, disabled):', event);
      return null;
    }

    // Filter out network errors and extension errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.toString().includes('NetworkError')) {
        return null;
      }

      // Filter out browser extension errors
      if (
        event.exception.values?.[0]?.stacktrace?.frames?.some(frame =>
          frame.filename?.includes('extension')
        )
      ) {
        return null;
      }
    }

    return event;
  },
});

// Required hook for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
