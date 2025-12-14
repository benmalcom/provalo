'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, Flex, VStack, Text } from '@chakra-ui/react';
import {
  LuWallet,
  LuArrowLeftRight,
  LuFileText,
  LuSettings,
  LuLogOut,
} from 'react-icons/lu';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { href: '/wallets', label: 'Wallets', icon: LuWallet },
  { href: '/transactions', label: 'Transactions', icon: LuArrowLeftRight },
  { href: '/reports', label: 'Reports', icon: LuFileText },
  { href: '/settings', label: 'Settings', icon: LuSettings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      as="aside"
      w="240px"
      h="100vh"
      bg="bg.surface"
      borderRight="1px solid"
      borderColor="border.muted"
      position="fixed"
      left={0}
      top={0}
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Flex
        h="64px"
        align="center"
        px={5}
        borderBottom="1px solid"
        borderColor="border.muted"
      >
        <Link href="/wallets">
          <Logo size="md" />
        </Link>
      </Flex>

      {/* Navigation */}
      <VStack as="nav" flex={1} py={4} px={3} gap={1} align="stretch">
        {navItems.map(item => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Flex
                align="center"
                gap={3}
                px={3}
                py={2.5}
                borderRadius="lg"
                bg={isActive ? 'bg.hover' : 'transparent'}
                color={isActive ? 'text.primary' : 'text.secondary'}
                _hover={{ bg: 'bg.hover', color: 'text.primary' }}
                transition="all 0.15s"
              >
                <Icon size={20} />
                <Text fontSize="sm" fontWeight={isActive ? '500' : '400'}>
                  {item.label}
                </Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>

      {/* Sign out */}
      <Box px={3} pb={4}>
        <Flex
          as="button"
          align="center"
          gap={3}
          px={3}
          py={2.5}
          w="full"
          borderRadius="lg"
          color="text.tertiary"
          _hover={{ bg: 'bg.hover', color: 'text.secondary' }}
          transition="all 0.15s"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LuLogOut size={20} />
          <Text fontSize="sm">Sign out</Text>
        </Flex>
      </Box>
    </Box>
  );
}
