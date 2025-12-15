import { useContext } from 'react';
import { WalletContext, type UseWalletReturn } from './WalletProvider';

/**
 * Hook to access wallet state and actions
 *
 * @example
 * ```typescript
 * const wallet = useWallet();
 *
 * if (!wallet.isConnected) {
 *   await wallet.connect();
 * }
 *
 * // Sign a message for wallet verification
 * const signature = await wallet.signMessage('Link wallet to Provalo');
 * ```
 */
export function useWallet(): UseWalletReturn {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      'useWallet must be used within WalletProvider. ' +
        'Make sure your app is wrapped with <AppKitProvider>.'
    );
  }

  return context;
}
