/**
 * useLinkedWallets Hook
 *
 * Manages linked wallets for the authenticated user.
 * Handles fetching, linking, updating, and removing wallets.
 */

'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { useWallet } from '@/lib/wallet';

// Types
export interface LinkedWallet {
  id: string;
  address: string;
  chainId: number;
  label: string | null;
  verifiedAt: string;
  createdAt: string;
}

interface UseLinkedWalletsReturn {
  // Data
  wallets: LinkedWallet[];
  isLoading: boolean;
  error: Error | null;

  // Actions
  linkWallet: (label?: string) => Promise<LinkedWallet>;
  updateWallet: (id: string, label: string | null) => Promise<LinkedWallet>;
  removeWallet: (id: string) => Promise<void>;
  refresh: () => Promise<void>;

  // State
  isLinking: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
}

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch');
  }
  return response.json();
};

/**
 * Hook to manage linked wallets
 */
export function useLinkedWallets(): UseLinkedWalletsReturn {
  const wallet = useWallet();

  // Fetch wallets with SWR
  const { data, error, isLoading } = useSWR<{ wallets: LinkedWallet[] }>(
    '/api/wallets',
    fetcher
  );

  // Action states
  const [isLinking, setIsLinking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  /**
   * Link current connected wallet to user account
   */
  const linkWallet = useCallback(
    async (label?: string): Promise<LinkedWallet> => {
      // Ensure wallet is connected
      if (!wallet.isConnected || !wallet.address) {
        throw new Error('No wallet connected');
      }

      setIsLinking(true);

      try {
        // Create message to sign
        const timestamp = Date.now();
        const message = [
          'Link wallet to Provalo',
          '',
          `Wallet: ${wallet.address}`,
          `Chain: ${wallet.chainId}`,
          `Timestamp: ${timestamp}`,
          '',
          'This signature proves you own this wallet.',
        ].join('\n');

        // Sign message
        const signature = await wallet.signMessage(message);

        // Send to API
        const response = await fetch('/api/wallets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: wallet.address,
            chainId: wallet.chainId,
            message,
            signature,
            label,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to link wallet');
        }

        const { wallet: linkedWallet } = await response.json();

        // Refresh wallet list
        await mutate('/api/wallets');

        return linkedWallet;
      } finally {
        setIsLinking(false);
      }
    },
    [wallet]
  );

  /**
   * Update wallet label
   */
  const updateWallet = useCallback(
    async (id: string, label: string | null): Promise<LinkedWallet> => {
      setIsUpdating(true);

      try {
        const response = await fetch(`/api/wallets/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update wallet');
        }

        const { wallet: updatedWallet } = await response.json();

        // Refresh wallet list
        await mutate('/api/wallets');

        return updatedWallet;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Remove wallet from account
   */
  const removeWallet = useCallback(async (id: string): Promise<void> => {
    setIsRemoving(true);

    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove wallet');
      }

      // Refresh wallet list
      await mutate('/api/wallets');
    } finally {
      setIsRemoving(false);
    }
  }, []);

  /**
   * Refresh wallet list
   */
  const refresh = useCallback(async (): Promise<void> => {
    await mutate('/api/wallets');
  }, []);

  return {
    // Data
    wallets: data?.wallets || [],
    isLoading,
    error: error || null,

    // Actions
    linkWallet,
    updateWallet,
    removeWallet,
    refresh,

    // State
    isLinking,
    isUpdating,
    isRemoving,
  };
}
