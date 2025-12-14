/**
 * Wallet Configuration with Reown AppKit
 * Uses WagmiAdapter for automatic connector setup
 */

import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
} from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';

/**
 * Project ID from Reown Dashboard
 */
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Get your project ID at https://cloud.reown.com'
  );
}

/**
 * Environment configuration
 */
export const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK_MODE === 'testnet';

/**
 * Supported networks - testnets first, then mainnets
 */
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  // Testnets
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  // Mainnets
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
];

/**
 * App metadata - URL must match your origin for allowlist
 */
const getMetadataUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // SSR fallback - must match allowlist
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007';
};

export const metadata = {
  name: 'Provalo',
  description: 'Convert crypto income into verifiable financial documents',
  url: getMetadataUrl(),
  icons: ['/images/logo.svg'],
};

/**
 * Wagmi Adapter - handles all connector setup automatically
 */
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

/**
 * Export the wagmi config from the adapter
 */
export const config = wagmiAdapter.wagmiConfig;
