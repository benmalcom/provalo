'use client';

import { Box, Flex } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Sidebar } from '@/components/layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show nothing while loading
  if (status === 'loading') {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0E14">
        <Box color="#6b7280">Loading...</Box>
      </Flex>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <Flex minH="100vh" bg="#0A0E14">
      <Sidebar />
      <Box ml="240px" flex={1}>
        {children}
      </Box>
    </Flex>
  );
}
