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
  LuX,
} from 'react-icons/lu';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { href: '/wallets', label: 'Wallets', icon: LuWallet },
  { href: '/transactions', label: 'Transactions', icon: LuArrowLeftRight },
  { href: '/reports', label: 'Reports', icon: LuFileText },
  { href: '/settings', label: 'Settings', icon: LuSettings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <Box
          display={{ base: 'block', lg: 'none' }}
          position="fixed"
          inset={0}
          bg="blackAlpha.700"
          zIndex={40}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
        zIndex={50}
        // Mobile: off-canvas with transform
        transform={{
          base: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          lg: 'translateX(0)',
        }}
        transition="transform 0.3s ease-in-out"
      >
        {/* Logo */}
        <Flex
          h="64px"
          align="center"
          px={5}
          borderBottom="1px solid"
          borderColor="border.muted"
          justify="space-between"
        >
          <Link href="/wallets" onClick={handleNavClick}>
            <Logo size="md" />
          </Link>
          {/* Mobile close button */}
          <Box
            as="button"
            display={{ base: 'flex', lg: 'none' }}
            alignItems="center"
            justifyContent="center"
            p={2}
            borderRadius="md"
            color="text.tertiary"
            _hover={{ bg: 'bg.hover', color: 'text.primary' }}
            onClick={onClose}
          >
            <LuX size={20} />
          </Box>
        </Flex>

        {/* Navigation */}
        <VStack as="nav" flex={1} py={4} px={3} gap={1} align="stretch">
          {navItems.map(item => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
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
    </>
  );
}
