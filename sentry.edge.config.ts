import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  debug: false,

  // Environment and release
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Enable in production by default, configurable in development
  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEV === 'true',

  // Initial scope for edge
  initialScope: {
    tags: {
      component: 'flip-app',
      platform: 'edge',
    },
    extra: {
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
      sha: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
  },
});
