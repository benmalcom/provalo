'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
  usePublicClient,
  useConfig,
} from 'wagmi';
import { getWalletClient } from 'wagmi/actions';
import type { Address } from 'viem';
import {
  DEFAULT_TOKENS,
  getTokenConfig,
  getTokenConfigByAddress,
} from './registry';
import {
  formatBalance,
  formatBalanceWithSymbol,
  shortenAddress,
  hasSufficientBalance,
  hasSufficientAllowance,
} from './utils';
import {
  readTokenBalance,
  readTokenAllowance,
  approveToken,
  waitForTransaction,
} from './blockchain';
import type { TokenState, TokenData, UseWalletReturn } from './types';

/**
 * Wallet Context
 */
export const WalletContext = createContext<UseWalletReturn | null>(null);

interface WalletProviderProps {
  children: React.ReactNode;
  openModal?: () => void;
}

export function WalletProvider({ children, openModal }: WalletProviderProps) {
  // Wagmi hooks
  const {
    address,
    isConnected,
    isConnecting: wagmiConnecting,
    connector,
  } = useAccount();
  const chainId = useChainId();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain: wagmiSwitchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const config = useConfig();

  // State
  const [tokens, setTokens] = useState<Map<Address, TokenState>>(new Map());
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  /**
   * Load token balance and allowances
   */
  const loadTokenState = useCallback(
    async (
      tokenAddress: Address,
      spenderAddresses?: Address[]
    ): Promise<TokenState> => {
      if (!address || !publicClient) {
        return {
          balance: 0n,
          allowances: new Map(),
          isLoading: false,
          lastUpdated: Date.now(),
        };
      }

      try {
        // Read token balance
        const balance = await readTokenBalance(
          publicClient,
          tokenAddress,
          address as Address
        );

        // Read allowances if spender addresses provided
        const allowances = new Map<Address, bigint>();
        if (spenderAddresses && spenderAddresses.length > 0) {
          await Promise.all(
            spenderAddresses.map(async spender => {
              const allowance = await readTokenAllowance(
                publicClient,
                tokenAddress,
                address as Address,
                spender
              );
              allowances.set(spender, allowance);
            })
          );
        }

        return {
          balance,
          allowances,
          isLoading: false,
          lastUpdated: Date.now(),
        };
      } catch (error) {
        console.error('Failed to load token state:', {
          tokenAddress,
          error,
        });

        return {
          balance: 0n,
          allowances: new Map(),
          isLoading: false,
          lastUpdated: Date.now(),
        };
      }
    },
    [address, publicClient]
  );

  /**
   * Load token by symbol
   */
  const loadToken = useCallback(
    async (symbol: string, spenderAddresses?: Address[]) => {
      const tokenConfig = getTokenConfig(symbol);
      if (!tokenConfig) {
        console.error('Token not found in registry:', symbol);
        return;
      }

      if (!address) {
        console.warn('Cannot load token without wallet connection:', symbol);
        return;
      }

      setIsLoadingTokens(true);

      try {
        const state = await loadTokenState(
          tokenConfig.address,
          spenderAddresses
        );

        setTokens(prev => {
          const next = new Map(prev);
          next.set(tokenConfig.address, state);
          return next;
        });
      } catch (error) {
        console.error('Failed to load token:', { symbol, error });
      } finally {
        setIsLoadingTokens(false);
      }
    },
    [address, loadTokenState]
  );

  /**
   * Load multiple tokens
   */
  const loadTokens = useCallback(
    async (symbols: string[], spenderAddresses?: Address[]) => {
      await Promise.all(
        symbols.map(symbol => loadToken(symbol, spenderAddresses))
      );
    },
    [loadToken]
  );

  /**
   * Refresh token balances
   */
  const refreshTokens = useCallback(
    async (symbols?: string[], spenderAddresses?: Address[]) => {
      if (!address) return;

      const tokensToRefresh =
        symbols ||
        (Array.from(tokens.keys())
          .map(addr => {
            const tokenConfig = getTokenConfigByAddress(addr);
            return tokenConfig?.symbol;
          })
          .filter(Boolean) as string[]);

      await loadTokens(tokensToRefresh, spenderAddresses);
    },
    [address, tokens, loadTokens]
  );

  /**
   * Connect wallet
   */
  /**
   * Connect wallet - opens AppKit modal
   */
  const connectWallet = useCallback(async () => {
    // Open AppKit modal - it handles everything
    if (openModal) {
      openModal();
    }
  }, [openModal]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(async () => {
    try {
      await wagmiDisconnect();
      setTokens(new Map());
      console.info('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [wagmiDisconnect]);

  /**
   * Switch chain
   */
  const switchChain = useCallback(
    async (targetChainId: number) => {
      try {
        await wagmiSwitchChain({ chainId: targetChainId });
        console.info('Chain switched to:', targetChainId);
      } catch (error) {
        console.error('Failed to switch chain:', error);
        throw error;
      }
    },
    [wagmiSwitchChain]
  );

  /**
   * Sign a message with the connected wallet
   */
  const signMessage = useCallback(
    async (message: string): Promise<`0x${string}`> => {
      if (!address) {
        throw new Error('No address available');
      }

      if (!isConnected || !connector) {
        throw new Error('Wallet not connected');
      }

      setIsSigning(true);
      try {
        // Get wallet client using wagmi action
        const walletClient = await getWalletClient(config);

        if (!walletClient) {
          console.error(
            'Could not get wallet client. Connector:',
            connector.name,
            'ChainId:',
            chainId
          );
          throw new Error(
            'Could not get wallet client. Please disconnect and reconnect your wallet.'
          );
        }

        const signature = await walletClient.signMessage({
          account: address as `0x${string}`,
          message,
        });

        console.info('Message signed successfully');
        return signature;
      } catch (error) {
        console.error('Failed to sign message:', error);
        throw error;
      } finally {
        setIsSigning(false);
      }
    },
    [address, isConnected, connector, config, chainId]
  );

  /**
   * Get token data with helpers
   */
  const getToken = useCallback(
    (symbol: string): TokenData | null => {
      const tokenConfig = getTokenConfig(symbol);
      if (!tokenConfig) return null;

      const state = tokens.get(tokenConfig.address);
      if (!state) return null;

      return {
        // Static
        address: tokenConfig.address,
        symbol: tokenConfig.symbol,
        name: tokenConfig.name,
        decimals: tokenConfig.decimals,
        logo: tokenConfig.logo,
        category: tokenConfig.category,

        // Dynamic
        balance: state.balance,
        allowances: state.allowances,
        formatted: formatBalance(state.balance, tokenConfig.decimals),
        isLoading: state.isLoading,

        // Helpers
        hasBalance: (amount: bigint) =>
          hasSufficientBalance(state.balance, amount),
        isApproved: (spender: Address, amount: bigint) => {
          const allowance = state.allowances.get(spender) || 0n;
          return hasSufficientAllowance(allowance, amount);
        },

        // Actions
        approve: async (spender: Address, amount: bigint) => {
          if (!publicClient) {
            throw new Error('No public client available');
          }

          const walletClient = await getWalletClient(config, { chainId });
          if (!walletClient) {
            throw new Error('No wallet connected');
          }

          try {
            // Send approval transaction
            const txHash = await approveToken(
              walletClient,
              publicClient,
              tokenConfig.address,
              spender,
              amount
            );

            // Wait for confirmation
            await waitForTransaction(publicClient, txHash);

            // Refresh token state
            await loadToken(symbol, [spender]);

            console.info('Token approved successfully:', {
              symbol,
              spender,
              amount: amount.toString(),
              txHash,
            });
          } catch (error) {
            console.error('Token approval failed:', {
              symbol,
              spender,
              amount: amount.toString(),
              error,
            });
            throw error;
          }
        },

        refresh: async () => {
          await loadToken(symbol);
        },
      };
    },
    [tokens, loadToken, config, chainId, publicClient]
  );

  /**
   * Check if token is loaded
   */
  const hasToken = useCallback(
    (symbol: string): boolean => {
      const tokenConfig = getTokenConfig(symbol);
      if (!tokenConfig) return false;
      return tokens.has(tokenConfig.address);
    },
    [tokens]
  );

  /**
   * Format helpers
   */
  const format = useMemo(
    () => ({
      address: (addr?: Address) => {
        const targetAddress = addr || (address as Address | undefined);
        if (!targetAddress) return '0x0000...0000';
        return shortenAddress(targetAddress);
      },
      balance: (symbol: string) => {
        const token = getToken(symbol);
        if (!token) return '0.00';
        return formatBalanceWithSymbol(
          token.balance,
          token.decimals,
          token.symbol
        );
      },
    }),
    [address, getToken]
  );

  /**
   * Load default tokens when wallet connects
   */
  useEffect(() => {
    if (isConnected && address) {
      loadTokens(DEFAULT_TOKENS as unknown as string[]);
    }
  }, [isConnected, address, loadTokens]);

  /**
   * Clear tokens when wallet disconnects
   */
  useEffect(() => {
    if (!isConnected) {
      setTokens(new Map());
    }
  }, [isConnected]);

  /**
   * Get token data map with helpers
   */
  const tokensWithHelpers = useMemo(() => {
    const result = new Map<Address, TokenData>();

    tokens.forEach((state, tokenAddress) => {
      const tokenConfig = getTokenConfigByAddress(tokenAddress);
      if (!tokenConfig) return;

      const tokenData: TokenData = {
        // Static
        address: tokenConfig.address,
        symbol: tokenConfig.symbol,
        name: tokenConfig.name,
        decimals: tokenConfig.decimals,
        logo: tokenConfig.logo,
        category: tokenConfig.category,

        // Dynamic
        balance: state.balance,
        allowances: state.allowances,
        formatted: formatBalance(state.balance, tokenConfig.decimals),
        isLoading: state.isLoading,

        // Helpers
        hasBalance: (amount: bigint) =>
          hasSufficientBalance(state.balance, amount),
        isApproved: (spender: Address, amount: bigint) => {
          const allowance = state.allowances.get(spender) || 0n;
          return hasSufficientAllowance(allowance, amount);
        },

        // Actions
        approve: async (spender: Address, amount: bigint) => {
          if (!publicClient) {
            throw new Error('No public client available');
          }

          const walletClient = await getWalletClient(config, { chainId });
          if (!walletClient) {
            throw new Error('No wallet connected');
          }

          try {
            const txHash = await approveToken(
              walletClient,
              publicClient,
              tokenConfig.address,
              spender,
              amount
            );
            await waitForTransaction(publicClient, txHash);
            await loadToken(tokenConfig.symbol, [spender]);

            console.info('Token approved successfully:', {
              symbol: tokenConfig.symbol,
              spender,
              txHash,
            });
          } catch (error) {
            console.error('Token approval failed:', {
              symbol: tokenConfig.symbol,
              error,
            });
            throw error;
          }
        },

        refresh: async () => {
          await loadToken(tokenConfig.symbol);
        },
      };

      result.set(tokenAddress, tokenData);
    });

    return result;
  }, [tokens, loadToken, config, chainId, publicClient]);

  /**
   * Context value
   */
  const value: UseWalletReturn = useMemo(
    () => ({
      // Identity
      isConnected,
      address: (address as Address) || null,
      chainId: chainId || 1,
      ens: null, // AppKit handles ENS

      // Connection
      connect: connectWallet,
      disconnect: disconnectWallet,

      // Chain
      switchChain,

      // Signing
      signMessage,
      isSigning,

      // Tokens
      tokens: tokensWithHelpers as ReadonlyMap<Address, TokenData>,
      getToken,
      hasToken,
      loadToken,
      refreshTokens,

      // Formatters
      format,

      // Loading states
      isConnecting: wagmiConnecting,
      isLoadingTokens,

      // Connector info (simplified for AppKit)
      connectors: [],
      activeConnector: null,

      // Modal controls - use AppKit
      openConnectModal: openModal,
      closeConnectModal: () => {},
      isConnectModalOpen: false,
    }),
    [
      isConnected,
      address,
      chainId,
      connectWallet,
      disconnectWallet,
      switchChain,
      signMessage,
      isSigning,
      tokensWithHelpers,
      getToken,
      hasToken,
      loadToken,
      refreshTokens,
      format,
      wagmiConnecting,
      isLoadingTokens,
      openModal,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
