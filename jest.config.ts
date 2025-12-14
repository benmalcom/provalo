import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',

  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}', // Also support __tests__ folders
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Add mock for CSS/SCSS if needed
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },

  // ESM modules that need transformation
  transformIgnorePatterns: [
    'node_modules/(?!(@ethersproject|ethers|@chakra-ui|@solana|@coral-xyz|uuid|@noble|@reown|@walletconnect)/)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/index.{js,jsx,ts,tsx}', // Exclude barrel exports
  ],

  // Coverage thresholds (adjust as needed)
  coverageThreshold: {
    global: {
      statements: 20, // Start low, increase gradually
      branches: 20,
      functions: 20,
      lines: 20,
    },
  },

  // Timeouts
  testTimeout: 10000, // 10 seconds for slow tests

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Verbose output
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);