/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [],
  },

  // Fix for @libsql/client and pdfkit
  serverExternalPackages: [
    '@libsql/client',
    '@prisma/adapter-libsql',
    'libsql',
    'pdfkit',
  ],

  webpack: (config, { isServer }) => {
    // Reown AppKit recommended externals
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for porto connector issue in @wagmi/connectors
    config.externals.push('porto');

    if (isServer) {
      config.externals.push(
        '@libsql/client',
        '@libsql/isomorphic-ws',
        'libsql'
      );
    }

    // Prevent MetaMask SDK native modules from breaking builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-url-polyfill': false,
      'react-native-get-random-values': false,
      'react-native-webview': false,
      'react-native-crypto': false,
      // Fix for @reown/appkit-adapter-wagmi porto module not found
      'porto/internal': false,
    };

    // Exclude Playwright and test dependencies from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@playwright/test': false,
        playwright: false,
        'playwright-core': false,
        fsevents: false,
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      path: false,
      os: false,
    };

    // Ignore README.md files in node_modules
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    return config;
  },
};

export default nextConfig;
