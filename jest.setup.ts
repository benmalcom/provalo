import '@testing-library/jest-dom';
import React from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: jest.fn().mockReturnValue([]),
}));

// Mock clipboard API
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      readText: jest.fn().mockImplementation(() => Promise.resolve('')),
    },
    writable: true,
    configurable: true,
  });
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const React = require('react');
  /* eslint-enable @typescript-eslint/no-require-imports */

  return function Link({
                         children,
                         href
                       }: {
    children: React.ReactNode;
    href: string
  }) {
    return React.createElement('a', { href }, children);
  };
});

// Mock window.fs (for file operations in artifacts)
if (typeof window !== 'undefined') {
  interface MockFileSystem {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  }

  (window as Window & { fs?: MockFileSystem }).fs = {
    readFile: jest.fn().mockResolvedValue(new Uint8Array()),
    writeFile: jest.fn().mockResolvedValue(undefined),
  };
}

// Mock TextEncoder/TextDecoder for crypto/web3 libraries
if (typeof global.TextEncoder === 'undefined') {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const util = require('util');
  /* eslint-enable @typescript-eslint/no-require-imports */

  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
}

// Mock crypto for Node.js environment
/* eslint-disable @typescript-eslint/no-require-imports */
const nodeCrypto = require('crypto');
/* eslint-enable @typescript-eslint/no-require-imports */

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      const buffer = nodeCrypto.randomBytes(arr.length);
      arr.set(buffer);
      return arr;
    },
    randomUUID: () => nodeCrypto.randomUUID(),
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
      generateKey: jest.fn(),
      deriveKey: jest.fn(),
      deriveBits: jest.fn(),
      importKey: jest.fn(),
      exportKey: jest.fn(),
      wrapKey: jest.fn(),
      unwrapKey: jest.fn(),
    },
  },
  writable: true,
  configurable: true,
});

// Mock Web3 wallet providers
global.window = global.window || ({} as Window & typeof globalThis);

// Define Ethereum provider interface
interface EthereumProvider {
  isMetaMask: boolean;
  request: jest.Mock;
  on: jest.Mock;
  removeListener: jest.Mock;
  selectedAddress: string | null;
  chainId: string;
  networkVersion: string;
  _metamask: {
    isUnlocked: jest.Mock;
  };
}

// Mock Ethereum provider
(window as Window & { ethereum?: EthereumProvider }).ethereum = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  selectedAddress: null,
  chainId: '0x1',
  networkVersion: '1',
  _metamask: {
    isUnlocked: jest.fn().mockResolvedValue(false),
  },
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
  writable: true,
});

// Suppress console errors in tests (optional)
// Uncomment if you want cleaner test output
// const originalError = console.error;
// const originalWarn = console.warn;
//
// beforeAll(() => {
//   console.error = jest.fn();
//   console.warn = jest.fn();
// });
//
// afterAll(() => {
//   console.error = originalError;
//   console.warn = originalWarn;
// });

// Mock environment variables
process.env.NEXT_PUBLIC_NETWORK = 'testnet';
process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test-project-id';