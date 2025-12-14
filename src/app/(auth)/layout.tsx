'use client';

import { Box, Container, Flex, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="420px" px={6} py={12}>
        {/* Auth Card */}
        <Box
          bg="bg.surface"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border.muted"
          p={8}
        >
          {children}
        </Box>

        {/* Footer */}
        <Flex
          justify="center"
          mt={8}
          gap={4}
          fontSize="sm"
          color="text.tertiary"
        >
          <Link
            asChild
            variant="plain"
            _hover={{ color: 'text.secondary' }}
            _focus={{ outline: 'none', boxShadow: 'none' }}
          >
            <NextLink href="/terms">Terms</NextLink>
          </Link>
          <Text>·</Text>
          <Link
            asChild
            variant="plain"
            _hover={{ color: 'text.secondary' }}
            _focus={{ outline: 'none', boxShadow: 'none' }}
          >
            <NextLink href="/privacy">Privacy</NextLink>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}
