'use client';

import React, { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId, networks } from './wallet.config';
import { WalletProvider } from './WalletProvider';

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Set up metadata
const metadata = {
  name: 'Provalo',
  description: 'Convert crypto income into verifiable financial documents',
  url:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3007',
  icons: ['/images/logo.svg'],
};

// Create the modal - this must be called outside of any React component
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks,
  defaultNetwork: networks[0],
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: [],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#06B6D4',
    '--w3m-border-radius-master': '12px',
  },
});

interface AppKitProviderProps {
  children: ReactNode;
  cookies?: string | null;
}

/**
 * AppKit Provider - Wraps the app with Wagmi and React Query
 */
export function AppKitProvider({ children, cookies }: AppKitProviderProps) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  const openModal = () => modal.open();

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <WalletProvider openModal={openModal}>{children}</WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
