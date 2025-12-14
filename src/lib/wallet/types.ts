/**
 * Wallet Module Types
 * For use with Reown (WalletConnect v3) + wagmi v2 + viem
 */

import type { Address } from 'viem';
import type { Connector } from 'wagmi';

/**
 * Token category for UI grouping
 */
export type TokenCategory = 'stablecoin' | 'native' | 'wrapped' | 'other';

/**
 * Token configuration (static data from registry)
 */
export interface TokenConfig {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
  category: TokenCategory;
}

/**
 * Token state (dynamic blockchain data)
 */
export interface TokenState {
  balance: bigint;
  allowances: Map<Address, bigint>; // spender => allowance
  isLoading: boolean;
  lastUpdated: number;
}

/**
 * Token data with helpers (combines config + state)
 */
export interface TokenData extends TokenConfig {
  // Dynamic state
  balance: bigint;
  allowances: Map<Address, bigint>;
  formatted: string;
  isLoading: boolean;

  // Helper methods
  hasBalance: (amount: bigint) => boolean;
  isApproved: (spender: Address, amount: bigint) => boolean;

  // Actions
  approve: (spender: Address, amount: bigint) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Wallet state
 */
export interface WalletState {
  isConnected: boolean;
  address: Address | null;
  chainId: number;
  ens?: string | null;
}

/**
 * Connection modal state
 */
export interface ConnectionModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Connector info for UI display
 */
export interface ConnectorInfo {
  id: string;
  name: string;
  icon?: string;
  ready: boolean;
}

/**
 * Wallet hook return type
 */
export interface UseWalletReturn extends WalletState {
  // Connection methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Chain methods
  switchChain: (chainId: number) => Promise<void>;

  // Signing
  signMessage: (message: string) => Promise<`0x${string}`>;
  isSigning: boolean;

  // Token management
  tokens: ReadonlyMap<Address, TokenData>;
  getToken: (symbol: string) => TokenData | null;
  hasToken: (symbol: string) => boolean;
  loadToken: (symbol: string, spenderAddresses?: Address[]) => Promise<void>;
  refreshTokens: (
    symbols?: string[],
    spenderAddresses?: Address[]
  ) => Promise<void>;

  // Format helpers
  format: {
    address: (address?: Address) => string;
    balance: (symbol: string) => string;
  };

  // Loading states
  isConnecting: boolean;
  isLoadingTokens: boolean;

  // Connector info
  connectors: ConnectorInfo[];
  activeConnector: Connector | null;

  // Modal controls (optional - for custom UI)
  openConnectModal?: () => void;
  closeConnectModal?: () => void;
  isConnectModalOpen?: boolean;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  hash: `0x${string}`;
  wait: () => Promise<void>;
}

/**
 * Approval state for a specific spender
 */
export interface ApprovalState {
  allowance: bigint;
  isApproved: boolean;
  isApproving: boolean;
  approve: () => Promise<void>;
}
