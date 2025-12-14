/**
 * Wallet Module
 *
 * Provides wallet connection, token management, and blockchain interactions
 * using Reown AppKit + wagmi v2 + viem.
 *
 * @example
 * ```typescript
 * import { useWallet, WalletProvider, AppKitProvider } from '@/lib/wallet';
 * import { useAppKit } from '@reown/appkit/react';
 *
 * // In your app root:
 * <AppKitProvider cookies={cookies}>
 *   <WalletProvider>
 *     <App />
 *   </WalletProvider>
 * </AppKitProvider>
 *
 * // To open connect modal:
 * const { open } = useAppKit();
 * <button onClick={() => open()}>Connect Wallet</button>
 *
 * // In any component:
 * const wallet = useWallet();
 * const usdc = wallet.getToken('USDC');
 * ```
 */

// Providers
export { WalletProvider, WalletContext } from './WalletProvider';
export { AppKitProvider } from './AppKitProvider';

// Legacy export for compatibility (use AppKitProvider instead)
export { AppKitProvider as Web3Provider } from './AppKitProvider';

// Hooks
export { useWallet } from './useWallet';

// Configuration
export {
  config,
  wagmiAdapter,
  projectId,
  networks,
  metadata,
  IS_TESTNET,
} from './wallet.config';

// Registry
export {
  TOKEN_REGISTRY,
  DEFAULT_TOKENS,
  getTokenConfig,
  getTokenConfigByAddress,
  getTokensByCategory,
  getSupportedTokenSymbols,
  isTokenSupported,
  isNativeToken,
} from './registry';

// Utilities
export {
  shortenAddress,
  formatBalance,
  formatBalanceWithSymbol,
  parseAmount,
  hasSufficientBalance,
  hasSufficientAllowance,
  isValidAddress,
  toChecksumAddress,
  formatUsd,
  formatPercentage,
} from './utils';

// Blockchain functions
export {
  readTokenBalance,
  readTokenAllowance,
  readTokenDecimals,
  readTokenSymbol,
  readTokenName,
  approveToken,
  waitForTransaction,
  getTransactionReceipt,
  readMultipleTokenBalances,
  estimateApprovalGas,
  isContract,
} from './blockchain';

// Types
export type {
  TokenCategory,
  TokenConfig,
  TokenState,
  TokenData,
  WalletState,
  UseWalletReturn,
  ConnectionModalState,
  ConnectorInfo,
  TransactionResult,
  ApprovalState,
} from './types';
