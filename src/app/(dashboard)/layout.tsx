'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LuMenu } from 'react-icons/lu';
import { Sidebar } from '@/components/layout';
import { Logo } from '@/components/ui/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show nothing while loading
  if (status === 'loading') {
    return (
      <Flex h="100vh" align="center" justify="center" bg="bg.canvas">
        <Box color="text.tertiary">Loading...</Box>
      </Flex>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <Box ml={{ base: 0, lg: '240px' }} minH="100vh">
        {/* Mobile header */}
        <Flex
          display={{ base: 'flex', lg: 'none' }}
          h="64px"
          align="center"
          justify="space-between"
          px={4}
          borderBottom="1px solid"
          borderColor="border.muted"
          bg="bg.surface"
          position="sticky"
          top={0}
          zIndex={30}
        >
          <Logo size="sm" />
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            color="text.secondary"
            _hover={{ bg: 'bg.hover', color: 'text.primary' }}
            onClick={() => setSidebarOpen(true)}
          >
            <LuMenu size={24} />
          </IconButton>
        </Flex>

        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
}
