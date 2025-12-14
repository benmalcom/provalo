'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/lib/hooks';
import { Avatar } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();
  const { user } = useUserProfile();

  // Prefer user profile data (from DB) over session data (from JWT)
  const displayName =
    user?.displayName || user?.name || session?.user?.name || 'User';
  const email = user?.email || session?.user?.email;
  const avatar = user?.avatar || session?.user?.avatar;

  return (
    <Box
      as="header"
      h={{ base: 'auto', lg: '64px' }}
      minH="56px"
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="border.muted"
      position="sticky"
      top={{ base: '64px', lg: 0 }}
      zIndex={10}
    >
      <Flex
        h="full"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={{ base: 3, lg: 0 }}
      >
        {/* Page title */}
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="600"
          color="text.primary"
        >
          {title}
        </Text>

        {/* User info - hidden on mobile (shown in sidebar instead) */}
        <Flex align="center" gap={3} display={{ base: 'none', md: 'flex' }}>
          <Box textAlign="right">
            <Text fontSize="sm" fontWeight="500" color="text.primary">
              {displayName}
            </Text>
            <Text fontSize="xs" color="text.tertiary">
              {email}
            </Text>
          </Box>
          <Avatar size="sm" name={displayName} src={avatar || undefined} />
        </Flex>
      </Flex>
    </Box>
  );
}
