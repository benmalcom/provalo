/**
 * Wallet Utility Functions
 */

import type { Address } from 'viem';
import { getAddress, isAddress } from 'viem';

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
