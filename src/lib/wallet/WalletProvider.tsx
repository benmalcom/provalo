'use client';

import React, { createContext, useCallback, useMemo, useState } from 'react';
import {
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useConfig,
} from 'wagmi';
import { getWalletClient } from 'wagmi/actions';
import type { Address } from 'viem';
import { shortenAddress } from './utils';

/**
 * Simplified wallet context for Provalo
 * Only provides: connect, disconnect, sign messages, switch chain
 */
export interface UseWalletReturn {
  // Identity
  isConnected: boolean;
  address: Address | null;
  chainId: number;

  // Connection
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Chain
  switchChain: (chainId: number) => Promise<void>;

  // Signing
  signMessage: (message: string) => Promise<`0x${string}`>;
  isSigning: boolean;

  // Formatters
  format: {
    address: (addr?: Address) => string;
  };

  // Loading states
  isConnecting: boolean;

  // Modal controls
  openConnectModal?: () => void;
}

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
  const config = useConfig();

  // Signing state
  const [isSigning, setIsSigning] = useState(false);

  /**
   * Connect wallet - opens AppKit modal
   */
  const connectWallet = useCallback(async () => {
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
   * Format helpers
   */
  const format = useMemo(
    () => ({
      address: (addr?: Address) => {
        const targetAddress = addr || (address as Address | undefined);
        if (!targetAddress) return '0x0000...0000';
        return shortenAddress(targetAddress);
      },
    }),
    [address]
  );

  /**
   * Context value
   */
  const value: UseWalletReturn = useMemo(
    () => ({
      // Identity
      isConnected,
      address: (address as Address) || null,
      chainId: chainId || 1,

      // Connection
      connect: connectWallet,
      disconnect: disconnectWallet,

      // Chain
      switchChain,

      // Signing
      signMessage,
      isSigning,

      // Formatters
      format,

      // Loading states
      isConnecting: wagmiConnecting,

      // Modal controls
      openConnectModal: openModal,
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
      format,
      wagmiConnecting,
      openModal,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
