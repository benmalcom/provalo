/**
 * Wallet Module
 *
 * Provides wallet connection and signing for Provalo
 * using Reown AppKit + wagmi v2 + viem.
 *
 * @example
 * ```typescript
 * import { useWallet, AppKitProvider } from '@/lib/wallet';
 * import { useAppKit } from '@reown/appkit/react';
 *
 * // In your app root:
 * <AppKitProvider cookies={cookies}>
 *   <App />
 * </AppKitProvider>
 *
 * // To open connect modal:
 * const { open } = useAppKit();
 * <button onClick={() => open()}>Connect Wallet</button>
 *
 * // In any component:
 * const wallet = useWallet();
 * await wallet.signMessage('Hello');
 * ```
 */

// Providers
export {
  WalletProvider,
  WalletContext,
  type UseWalletReturn,
} from './WalletProvider';
export { AppKitProvider } from './AppKitProvider';

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

// Utilities (keep only what's needed)
export { shortenAddress, isValidAddress, toChecksumAddress } from './utils';
