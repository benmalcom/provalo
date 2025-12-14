/**
 * Wallet Utility Functions
 */

import type { Address } from 'viem';
import { formatUnits, getAddress, isAddress } from 'viem';
import type { TokenConfig } from './types';

/**
 * Shorten address for display
 * @example "0x1234...5678"
 */
export function shortenAddress(
  address: Address,
  startChars = 6,
  endChars = 4
): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format token balance for display
 * @example formatBalance(1000000n, 6) => "1.00"
 */
export function formatBalance(balance: bigint, decimals: number): string {
  const formatted = formatUnits(balance, decimals);
  const num = parseFloat(formatted);

  // Format with appropriate decimals
  if (num === 0) return '0.00';
  if (num < 0.01) return '<0.01';
  if (num < 1) return num.toFixed(4);
  if (num < 1000) return num.toFixed(2);

  // Format with commas for large numbers
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format token balance with symbol
 * @example "1,234.56 USDC"
 */
export function formatBalanceWithSymbol(
  balance: bigint,
  decimals: number,
  symbol: string
): string {
  return `${formatBalance(balance, decimals)} ${symbol}`;
}

/**
 * Parse amount string to bigint
 * @example parseAmount("100", 6) => 100000000n
 */
export function parseAmount(amount: string, decimals: number): bigint {
  try {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) {
      throw new Error('Invalid amount');
    }

    // Handle the conversion carefully to avoid precision issues
    const [intPart, decPart = ''] = amount.split('.');
    const paddedDecPart = decPart.padEnd(decimals, '0').slice(0, decimals);
    const combined = intPart + paddedDecPart;

    return BigInt(combined);
  } catch (error) {
    console.error(`Error parsing ${amount}:`, error);
    throw new Error(`Failed to parse amount: ${amount}`);
  }
}

/**
 * Check if balance is sufficient
 */
export function hasSufficientBalance(
  balance: bigint,
  required: bigint
): boolean {
  return balance >= required;
}

/**
 * Check if allowance is sufficient
 */
export function hasSufficientAllowance(
  allowance: bigint,
  required: bigint
): boolean {
  return allowance >= required;
}

/**
 * Get token config key (symbol) from address
 */
export function getTokenSymbolFromAddress(
  address: Address,
  tokens: Record<string, TokenConfig>
): string | null {
  const entry = Object.entries(tokens).find(
    ([, config]) => config.address.toLowerCase() === address.toLowerCase()
  );
  return entry ? entry[0] : null;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): address is Address {
  return isAddress(address);
}

/**
 * Convert to checksum address
 */
export function toChecksumAddress(address: string): Address {
  if (!isValidAddress(address)) {
    throw new Error('Invalid address');
  }
  return getAddress(address);
}

/**
 * Format USD value
 * @example formatUsd(1234.56) => "$1,234.56"
 */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Format percentage
 * @example formatPercentage(0.1234) => "12.34%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Delay helper for rate limiting
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await delay(baseDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError;
}
