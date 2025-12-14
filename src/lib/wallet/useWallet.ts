
import { useContext } from 'react';
import { WalletContext } from './WalletProvider';
import type { UseWalletReturn } from './types';

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
 * const usdc = wallet.getToken('USDC');
 * if (usdc && usdc.hasBalance(amount)) {
 *   await usdc.approve(spender, amount);
 * }
 * ```
 */
export function useWallet(): UseWalletReturn {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      'useWallet must be used within WalletProvider. ' +
      'Make sure your app is wrapped with <WalletProvider>.'
    );
  }

  return context;
}