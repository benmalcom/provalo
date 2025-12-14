// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({
                                      error,
                                      reset,
                                    }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry with additional context
    console.error('Global error:', error);
  }, [error]);

  return (
    <html style={{ margin: 0, padding: 0, height: '100%' }}>
    <body style={{ margin: 0, padding: 0, height: '100%' }}>
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0a0e1a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            lineHeight: 1,
          }}
        >
          🚨
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            margin: '0 0 1rem 0',
            background: 'linear-gradient(135deg, #ef4444, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Application Error
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.6,
          }}
        >
          A critical error occurred. Please refresh the page or try again
          later.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: '0.875rem',
              marginBottom: '2rem',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'monospace',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0.25rem',
            }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={reset}
            style={{
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              padding: '0.875rem 2rem',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
    </body>
    </html>
  );
}