/**
 * AppKit Initialization
 *
 * This module initializes AppKit once at import time.
 * Import this module before using any AppKit hooks.
 */

import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, networks, metadata } from './wallet.config';

// Track if AppKit has been initialized
let isInitialized = false;

/**
 * Initialize AppKit (idempotent - safe to call multiple times)
 */
export function initializeAppKit() {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }

  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId!,
    networks,
    metadata,
    features: {
      analytics: true,
      email: false,
      socials: [],
    },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#06B6D4',
      '--w3m-border-radius-master': '12px',
    },
  });

  isInitialized = true;
}

// Initialize immediately when this module is imported on the client
if (typeof window !== 'undefined') {
  initializeAppKit();
}
