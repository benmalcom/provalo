'use client';

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { AppKitProvider } from '@/lib/wallet';
import { system } from '@/theme';

interface ProvidersProps {
  children: React.ReactNode;
  cookies?: string | null;
}

/**
 * Application Providers
 *
 * Wraps the app with all necessary providers in the correct order:
 * 1. SessionProvider - NextAuth session
 * 2. ChakraProvider - UI styling
 * 3. AppKitProvider - Reown AppKit + wagmi + react-query + WalletProvider
 */
export function Providers({ children, cookies }: ProvidersProps) {
  return (
    <SessionProvider>
      <ChakraProvider value={system}>
        <AppKitProvider cookies={cookies}>{children}</AppKitProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
