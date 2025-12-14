/**
 * Alchemy Service
 *
 * Fetches transaction history across multiple EVM chains using Alchemy's
 * alchemy_getAssetTransfers API.
 */

// Chain configurations with Alchemy network names
export const ALCHEMY_CHAINS = {
  // Mainnets
  1: { name: 'eth-mainnet', label: 'Ethereum' },
  137: { name: 'polygon-mainnet', label: 'Polygon' },
  42161: { name: 'arb-mainnet', label: 'Arbitrum' },
  10: { name: 'opt-mainnet', label: 'Optimism' },
  8453: { name: 'base-mainnet', label: 'Base' },
  // Testnets
  11155111: { name: 'eth-sepolia', label: 'Sepolia' },
  84532: { name: 'base-sepolia', label: 'Base Sepolia' },
  421614: { name: 'arb-sepolia', label: 'Arbitrum Sepolia' },
  11155420: { name: 'opt-sepolia', label: 'Optimism Sepolia' },
} as const;

export type SupportedChainId = keyof typeof ALCHEMY_CHAINS;

// Types for Alchemy API responses
export interface AlchemyTransfer {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  erc721TokenId: string | null;
  erc1155Metadata: unknown | null;
  tokenId: string | null;
  asset: string;
  category:
    | 'external'
    | 'internal'
    | 'erc20'
    | 'erc721'
    | 'erc1155'
    | 'specialnft';
  rawContract: {
    value: string | null;
    address: string | null;
    decimal: string | null;
  };
  metadata: {
    blockTimestamp: string;
  };
}

export interface AlchemyResponse {
  jsonrpc: string;
  id: number;
  result: {
    transfers: AlchemyTransfer[];
    pageKey?: string;
  };
}

// Normalized transaction format
export interface NormalizedTransaction {
  txHash: string;
  chainId: number;
  fromAddress: string;
  toAddress: string;
  amount: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  timestamp: Date;
  category: string;
}

/**
 * Get Alchemy API URL for a chain
 */
function getAlchemyUrl(chainId: number): string | null {
  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    console.error('[Alchemy] Missing ALCHEMY_API_KEY');
    return null;
  }

  const chain = ALCHEMY_CHAINS[chainId as SupportedChainId];
  if (!chain) {
    console.error(`[Alchemy] Unsupported chain: ${chainId}`);
    return null;
  }

  return `https://${chain.name}.g.alchemy.com/v2/${apiKey}`;
}

/**
 * Fetch incoming transactions for an address on a specific chain
 */
export async function fetchIncomingTransactions(
  address: string,
  chainId: number,
  options?: {
    fromBlock?: string;
    toBlock?: string;
    pageKey?: string;
    maxCount?: number;
  }
): Promise<{ transactions: NormalizedTransaction[]; pageKey?: string }> {
  const url = getAlchemyUrl(chainId);
  if (!url) {
    return { transactions: [] };
  }

  const {
    fromBlock = '0x0',
    toBlock = 'latest',
    pageKey,
    maxCount = 100,
  } = options || {};

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock,
            toBlock,
            toAddress: address,
            category: ['external', 'erc20'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: `0x${maxCount.toString(16)}`,
            order: 'desc',
            ...(pageKey && { pageKey }),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`[Alchemy] HTTP error: ${response.status}`);
      return { transactions: [] };
    }

    const data: AlchemyResponse = await response.json();

    if (!data.result?.transfers) {
      console.error('[Alchemy] No transfers in response');
      return { transactions: [] };
    }

    const transactions = data.result.transfers.map(tx =>
      normalizeTransaction(tx, chainId)
    );

    return {
      transactions,
      pageKey: data.result.pageKey,
    };
  } catch (error) {
    console.error('[Alchemy] Fetch error:', error);
    return { transactions: [] };
  }
}

/**
 * Fetch all incoming transactions across multiple chains
 */
export async function fetchAllIncomingTransactions(
  address: string,
  chainIds: number[],
  options?: {
    fromBlock?: string;
    toBlock?: string;
    maxCountPerChain?: number;
  }
): Promise<NormalizedTransaction[]> {
  const results = await Promise.all(
    chainIds.map(chainId =>
      fetchIncomingTransactions(address, chainId, {
        fromBlock: options?.fromBlock,
        toBlock: options?.toBlock,
        maxCount: options?.maxCountPerChain,
      })
    )
  );

  // Combine and sort by timestamp descending
  const allTransactions = results.flatMap(r => r.transactions);
  allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return allTransactions;
}

/**
 * Normalize Alchemy transfer to our format
 */
function normalizeTransaction(
  tx: AlchemyTransfer,
  chainId: number
): NormalizedTransaction {
  // Determine token details
  const isNative = tx.category === 'external';
  const tokenAddress = isNative
    ? '0x0000000000000000000000000000000000000000'
    : tx.rawContract.address || '';
  const tokenSymbol =
    tx.asset || (isNative ? getNativeSymbol(chainId) : 'UNKNOWN');
  const tokenDecimals = tx.rawContract.decimal
    ? parseInt(tx.rawContract.decimal, 16)
    : 18;

  // Parse amount
  let amount = '0';
  if (tx.value !== null) {
    amount = tx.value.toString();
  } else if (tx.rawContract.value) {
    // Convert hex to decimal string
    const bigIntValue = BigInt(tx.rawContract.value);
    amount = bigIntValue.toString();
  }

  return {
    txHash: tx.hash,
    chainId,
    fromAddress: tx.from.toLowerCase(),
    toAddress: tx.to.toLowerCase(),
    amount,
    tokenAddress: tokenAddress.toLowerCase(),
    tokenSymbol,
    tokenDecimals,
    timestamp: new Date(tx.metadata.blockTimestamp),
    category: tx.category,
  };
}

/**
 * Get native token symbol for a chain
 */
function getNativeSymbol(chainId: number): string {
  const symbols: Record<number, string> = {
    1: 'ETH',
    137: 'MATIC',
    42161: 'ETH',
    10: 'ETH',
    8453: 'ETH',
    11155111: 'ETH',
    84532: 'ETH',
    421614: 'ETH',
    11155420: 'ETH',
  };
  return symbols[chainId] || 'ETH';
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in ALCHEMY_CHAINS;
}

/**
 * Get chain label
 */
export function getChainLabel(chainId: number): string {
  return (
    ALCHEMY_CHAINS[chainId as SupportedChainId]?.label || `Chain ${chainId}`
  );
}
