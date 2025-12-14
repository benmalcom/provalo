/**
 * useTransactions Hook (Hybrid Approach)
 *
 * Fetches transactions from Alchemy via API, merged with our metadata.
 */

'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

// Types matching EnrichedTransaction from service
export interface Transaction {
  txHash: string;
  chainId: number;
  chainLabel: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  timestamp: string; // ISO string from JSON
  category: string;
  amountUsd: number | null;
  metaId: string | null;
  userLabel: string | null;
  verifiedSender: {
    id: string;
    companyName: string;
    officialLabel: string;
    logoUrl: string | null;
  } | null;
  wallet: {
    id: string;
    label: string | null;
    address: string;
  };
}

export interface TransactionSummary {
  totalTransactions: number;
  verifiedTransactions: number;
  labeledTransactions: number;
  totalIncome: number;
  verifiedIncome: number;
}

export interface TransactionFilters {
  walletId?: string;
  refresh?: boolean;
  limit?: number;
}

interface UseTransactionsReturn {
  // Data
  transactions: Transaction[];
  summary: TransactionSummary | null;
  total: number;
  isLoading: boolean;
  error: Error | null;

  // Actions
  updateLabel: (tx: Transaction, label: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;

  // State
  isUpdating: boolean;
}

// Fetcher
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch');
  }
  return response.json();
};

// Build query string from filters
function buildQueryString(filters: TransactionFilters): string {
  const params = new URLSearchParams();

  if (filters.walletId) params.set('walletId', filters.walletId);
  if (filters.refresh) params.set('refresh', 'true');
  if (filters.limit) params.set('limit', String(filters.limit));

  return params.toString();
}

/**
 * Hook to manage transactions
 */
export function useTransactions(
  filters: TransactionFilters = {}
): UseTransactionsReturn {
  const queryString = buildQueryString({ limit: 50, ...filters });
  const swrKey = `/api/transactions?${queryString}`;

  const { data, error, isLoading } = useSWR<{
    transactions: Transaction[];
    summary: TransactionSummary;
    total: number;
  }>(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  });

  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Update transaction label
   */
  const updateLabel = useCallback(
    async (tx: Transaction, label: string): Promise<void> => {
      setIsUpdating(true);

      try {
        const response = await fetch(`/api/transactions/${tx.txHash}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userLabel: label,
            txHash: tx.txHash,
            chainId: tx.chainId,
            walletId: tx.wallet.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update');
        }

        // Optimistically update local data
        await mutate(swrKey);
      } finally {
        setIsUpdating(false);
      }
    },
    [swrKey]
  );

  /**
   * Force refresh transactions (skip cache)
   */
  const refreshTransactions = useCallback(async (): Promise<void> => {
    const refreshKey = swrKey.includes('refresh=true')
      ? swrKey
      : `${swrKey}${swrKey.includes('?') ? '&' : '?'}refresh=true`;
    await mutate(refreshKey);
    await mutate(swrKey);
  }, [swrKey]);

  return {
    transactions: data?.transactions || [],
    summary: data?.summary || null,
    total: data?.total || 0,
    isLoading,
    error: error || null,
    updateLabel,
    refreshTransactions,
    isUpdating,
  };
}

/**
 * Format transaction amount for display
 */
export function formatTransactionAmount(
  amount: string,
  decimals: number,
  symbol: string
): string {
  const value = parseFloat(amount) / Math.pow(10, decimals);

  // Format based on size
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M ${symbol}`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K ${symbol}`;
  }
  if (value >= 1) {
    return `${value.toFixed(4)} ${symbol}`;
  }
  return `${value.toFixed(6)} ${symbol}`;
}

/**
 * Format USD amount
 */
export function formatUsdAmount(amount: number | null): string {
  if (amount === null) return '—';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
