/**
 * Price Service
 *
 * Fetches token prices from CoinGecko for USD conversion.
 * Includes caching to respect rate limits.
 */

// CoinGecko token IDs for common tokens
const TOKEN_IDS: Record<string, string> = {
  ETH: 'ethereum',
  WETH: 'weth',
  MATIC: 'matic-network',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  WBTC: 'wrapped-bitcoin',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  ARB: 'arbitrum',
  OP: 'optimism',
};

// Simple in-memory cache
interface CacheEntry {
  price: number;
  timestamp: number;
}

const priceCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get current price for a token in USD
 */
export async function getTokenPrice(symbol: string): Promise<number | null> {
  const normalizedSymbol = symbol.toUpperCase();

  // Stablecoins are always ~$1
  if (['USDC', 'USDT', 'DAI', 'BUSD', 'TUSD'].includes(normalizedSymbol)) {
    return 1;
  }

  // Check cache
  const cached = priceCache.get(normalizedSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  const tokenId = TOKEN_IDS[normalizedSymbol];
  if (!tokenId) {
    console.warn(`[Price] Unknown token: ${symbol}`);
    return null;
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[Price] CoinGecko error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const price = data[tokenId]?.usd;

    if (typeof price === 'number') {
      // Cache the price
      priceCache.set(normalizedSymbol, {
        price,
        timestamp: Date.now(),
      });
      return price;
    }

    return null;
  } catch (error) {
    console.error('[Price] Fetch error:', error);
    return null;
  }
}

/**
 * Get historical price for a token at a specific date
 */
export async function getHistoricalPrice(
  symbol: string,
  date: Date
): Promise<number | null> {
  const normalizedSymbol = symbol.toUpperCase();

  // Stablecoins are always ~$1
  if (['USDC', 'USDT', 'DAI', 'BUSD', 'TUSD'].includes(normalizedSymbol)) {
    return 1;
  }

  const tokenId = TOKEN_IDS[normalizedSymbol];
  if (!tokenId) {
    console.warn(`[Price] Unknown token: ${symbol}`);
    return null;
  }

  // Format date as dd-mm-yyyy for CoinGecko
  const dateStr = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/history?date=${dateStr}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Rate limited or error - fall back to current price
      console.warn(`[Price] Historical price unavailable, using current`);
      return getTokenPrice(symbol);
    }

    const data = await response.json();
    return data.market_data?.current_price?.usd || null;
  } catch (error) {
    console.error('[Price] Historical fetch error:', error);
    return null;
  }
}

/**
 * Convert token amount to USD
 */
export function convertToUsd(
  amount: string,
  decimals: number,
  priceUsd: number
): number {
  const value = parseFloat(amount) / Math.pow(10, decimals);
  return value * priceUsd;
}

/**
 * Format USD amount
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Clear price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
