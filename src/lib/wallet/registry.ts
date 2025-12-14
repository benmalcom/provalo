/**
 * Token Registry
 * Static configuration for supported tokens
 */

import type { Address } from 'viem';
import type { TokenConfig, TokenCategory } from './types';
import { IS_TESTNET } from './wallet.config';

/**
 * Token addresses for Base Mainnet
 */
const BASE_MAINNET_TOKENS: Record<string, TokenConfig> = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as Address, // Native ETH
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/tokens/eth.svg',
    category: 'native',
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/tokens/usdc.svg',
    category: 'stablecoin',
  },
  USDT: {
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as Address,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: '/tokens/usdt.svg',
    category: 'stablecoin',
  },
  DAI: {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as Address,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logo: '/tokens/dai.svg',
    category: 'stablecoin',
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006' as Address,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logo: '/tokens/weth.svg',
    category: 'wrapped',
  },
};

/**
 * Token addresses for Base Sepolia (Testnet)
 * Note: These are example addresses - replace with actual testnet token addresses
 */
const BASE_SEPOLIA_TOKENS: Record<string, TokenConfig> = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as Address,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/tokens/eth.svg',
    category: 'native',
  },
  USDC: {
    // Base Sepolia USDC - you may need to deploy or find the actual testnet address
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/tokens/usdc.svg',
    category: 'stablecoin',
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006' as Address,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logo: '/tokens/weth.svg',
    category: 'wrapped',
  },
};

/**
 * Active token registry based on network
 */
export const TOKEN_REGISTRY: Record<string, TokenConfig> = IS_TESTNET
  ? BASE_SEPOLIA_TOKENS
  : BASE_MAINNET_TOKENS;

/**
 * Default tokens to load on wallet connection
 */
export const DEFAULT_TOKENS = ['ETH', 'USDC'] as const;

/**
 * Get token configuration by symbol
 */
export function getTokenConfig(symbol: string): TokenConfig | null {
  return TOKEN_REGISTRY[symbol.toUpperCase()] || null;
}

/**
 * Get token configuration by address
 */
export function getTokenConfigByAddress(address: Address): TokenConfig | null {
  const normalizedAddress = address.toLowerCase();

  const entry = Object.values(TOKEN_REGISTRY).find(
    config => config.address.toLowerCase() === normalizedAddress
  );

  return entry || null;
}

/**
 * Get all tokens by category
 */
export function getTokensByCategory(category: TokenCategory): TokenConfig[] {
  return Object.values(TOKEN_REGISTRY).filter(
    token => token.category === category
  );
}

/**
 * Get all supported token symbols
 */
export function getSupportedTokenSymbols(): string[] {
  return Object.keys(TOKEN_REGISTRY);
}

/**
 * Check if a token is supported
 */
export function isTokenSupported(symbol: string): boolean {
  return symbol.toUpperCase() in TOKEN_REGISTRY;
}

/**
 * Check if address is the native token (ETH)
 */
export function isNativeToken(address: Address): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}
