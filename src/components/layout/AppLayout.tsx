'use client';

import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return <Box>{children}</Box>;
}
