/**
 * Transaction Service (Hybrid Approach)
 *
 * - Fetches transaction data from Alchemy on demand
 * - Stores only user metadata (labels, verification) in DB
 * - Merges both for display
 */

import { prisma } from '@/lib/db';
import {
  fetchIncomingTransactions,
  isChainSupported,
  getChainLabel,
  type NormalizedTransaction,
} from './alchemy';
import { getHistoricalPrice, convertToUsd } from './price';

// Combined transaction type (Alchemy data + our metadata)
export interface EnrichedTransaction {
  // From Alchemy
  txHash: string;
  chainId: number;
  chainLabel: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  timestamp: Date;
  category: string;

  // Computed
  amountUsd: number | null;

  // From our DB (if exists)
  metaId: string | null;
  userLabel: string | null;
  verifiedSender: {
    id: string;
    companyName: string;
    officialLabel: string;
    logoUrl: string | null;
  } | null;

  // Wallet info
  wallet: {
    id: string;
    label: string | null;
    address: string;
  };
}

export interface FetchTransactionsResult {
  transactions: EnrichedTransaction[];
  pageKey?: string;
  fromCache: boolean;
}

// Simple in-memory cache for transactions (5 min TTL)
interface CacheEntry {
  transactions: NormalizedTransaction[];
  timestamp: number;
}
const txCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get transactions for a wallet with metadata merged
 */
export async function getWalletTransactions(
  userId: string,
  walletId: string,
  options?: {
    maxCount?: number;
    pageKey?: string;
    skipCache?: boolean;
  }
): Promise<FetchTransactionsResult> {
  const { maxCount = 50, pageKey, skipCache = false } = options || {};

  // Get wallet
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    select: {
      id: true,
      address: true,
      chainId: true,
      label: true,
      userId: true,
    },
  });

  if (!wallet || wallet.userId !== userId) {
    throw new Error('Wallet not found');
  }

  if (!isChainSupported(wallet.chainId)) {
    return { transactions: [], fromCache: false };
  }

  // Check cache
  const cacheKey = `${wallet.address}-${wallet.chainId}`;
  const cached = txCache.get(cacheKey);
  let rawTransactions: NormalizedTransaction[];
  let fromCache = false;
  let nextPageKey: string | undefined;

  if (
    !skipCache &&
    cached &&
    Date.now() - cached.timestamp < CACHE_TTL &&
    !pageKey
  ) {
    rawTransactions = cached.transactions;
    fromCache = true;
  } else {
    // Fetch from Alchemy
    const result = await fetchIncomingTransactions(
      wallet.address,
      wallet.chainId,
      {
        maxCount,
        pageKey,
      }
    );
    rawTransactions = result.transactions;
    nextPageKey = result.pageKey;

    // Cache if first page
    if (!pageKey) {
      txCache.set(cacheKey, {
        transactions: rawTransactions,
        timestamp: Date.now(),
      });
    }
  }

  // Get metadata for these transactions from our DB
  const txHashes = rawTransactions.map(tx => tx.txHash);
  const metaRecords = await prisma.transactionMeta.findMany({
    where: {
      txHash: { in: txHashes },
      chainId: wallet.chainId,
      userId,
    },
    include: {
      verifiedSender: {
        select: {
          id: true,
          companyName: true,
          officialLabel: true,
          logoUrl: true,
        },
      },
    },
  });

  // Create lookup map
  const metaMap = new Map(metaRecords.map(m => [m.txHash, m]));

  // Also check for verified senders by fromAddress
  const fromAddresses = [...new Set(rawTransactions.map(tx => tx.fromAddress))];
  const verifiedSenders = await prisma.verifiedSender.findMany({
    where: {
      address: { in: fromAddresses },
      chainId: wallet.chainId,
      isActive: true,
    },
    select: {
      id: true,
      address: true,
      companyName: true,
      officialLabel: true,
      logoUrl: true,
    },
  });
  const senderMap = new Map(
    verifiedSenders.map(s => [s.address.toLowerCase(), s])
  );

  // Enrich transactions with metadata and USD prices
  const enrichedTransactions: EnrichedTransaction[] = await Promise.all(
    rawTransactions.map(async tx => {
      const meta = metaMap.get(tx.txHash);
      const sender =
        meta?.verifiedSender ||
        senderMap.get(tx.fromAddress.toLowerCase()) ||
        null;

      // Get USD price (use cached price service)
      let amountUsd: number | null = null;
      try {
        const price = await getHistoricalPrice(tx.tokenSymbol, tx.timestamp);
        if (price) {
          amountUsd = convertToUsd(tx.amount, tx.tokenDecimals, price);
        }
      } catch {
        // Price fetch failed, leave as null
      }

      return {
        txHash: tx.txHash,
        chainId: tx.chainId,
        chainLabel: getChainLabel(tx.chainId),
        fromAddress: tx.fromAddress,
        toAddress: tx.toAddress,
        amount: tx.amount,
        tokenAddress: tx.tokenAddress,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimals: tx.tokenDecimals,
        timestamp: tx.timestamp,
        category: tx.category,
        amountUsd,
        metaId: meta?.id || null,
        userLabel: meta?.userLabel || null,
        verifiedSender: sender,
        wallet: {
          id: wallet.id,
          label: wallet.label,
          address: wallet.address,
        },
      };
    })
  );

  return {
    transactions: enrichedTransactions,
    pageKey: nextPageKey,
    fromCache,
  };
}

/**
 * Get transactions for all user wallets
 */
export async function getAllUserTransactions(
  userId: string,
  options?: {
    maxCountPerWallet?: number;
    skipCache?: boolean;
  }
): Promise<EnrichedTransaction[]> {
  const { maxCountPerWallet = 50, skipCache = false } = options || {};

  const wallets = await prisma.wallet.findMany({
    where: { userId },
    select: { id: true },
  });

  const results = await Promise.all(
    wallets.map(w =>
      getWalletTransactions(userId, w.id, {
        maxCount: maxCountPerWallet,
        skipCache,
      })
    )
  );

  // Combine and sort by timestamp
  const allTransactions = results.flatMap(r => r.transactions);
  allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return allTransactions;
}

/**
 * Set or update a transaction label
 * Creates TransactionMeta record if it doesn't exist
 */
export async function setTransactionLabel(
  userId: string,
  txHash: string,
  chainId: number,
  walletId: string,
  label: string
): Promise<void> {
  // Verify wallet ownership
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    select: { userId: true },
  });

  if (!wallet || wallet.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Upsert the metadata
  await prisma.transactionMeta.upsert({
    where: {
      txHash_chainId: { txHash, chainId },
    },
    create: {
      txHash,
      chainId,
      userLabel: label || null,
      userId,
      walletId,
    },
    update: {
      userLabel: label || null,
    },
  });
}

/**
 * Link a transaction to a verified sender
 */
export async function linkVerifiedSender(
  userId: string,
  txHash: string,
  chainId: number,
  walletId: string,
  verifiedSenderId: string
): Promise<void> {
  // Verify wallet ownership
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    select: { userId: true },
  });

  if (!wallet || wallet.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Upsert the metadata
  await prisma.transactionMeta.upsert({
    where: {
      txHash_chainId: { txHash, chainId },
    },
    create: {
      txHash,
      chainId,
      verifiedSenderId,
      userId,
      walletId,
    },
    update: {
      verifiedSenderId,
    },
  });
}

/**
 * Get transaction summary for reporting
 */
export async function getTransactionSummary(
  transactions: EnrichedTransaction[]
): Promise<{
  totalTransactions: number;
  verifiedTransactions: number;
  labeledTransactions: number;
  totalIncome: number;
  verifiedIncome: number;
}> {
  const totalIncome = transactions.reduce(
    (sum, tx) => sum + (tx.amountUsd || 0),
    0
  );
  const verifiedTxs = transactions.filter(tx => tx.verifiedSender);
  const verifiedIncome = verifiedTxs.reduce(
    (sum, tx) => sum + (tx.amountUsd || 0),
    0
  );
  const labeledCount = transactions.filter(tx => tx.userLabel).length;

  return {
    totalTransactions: transactions.length,
    verifiedTransactions: verifiedTxs.length,
    labeledTransactions: labeledCount,
    totalIncome,
    verifiedIncome,
  };
}

/**
 * Clear transaction cache for a wallet
 */
export function clearTransactionCache(address: string, chainId: number): void {
  const cacheKey = `${address.toLowerCase()}-${chainId}`;
  txCache.delete(cacheKey);
}

/**
 * Clear all transaction cache
 */
export function clearAllTransactionCache(): void {
  txCache.clear();
}
