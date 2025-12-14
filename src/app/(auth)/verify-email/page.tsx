'use client';

import NextLink from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Link,
  Button,
} from '@chakra-ui/react';
import { LuMail, LuArrowLeft } from 'react-icons/lu';
import { Logo } from '@/components/ui/Logo';

export default function VerifyEmailPage() {
  return (
    <Box>
      {/* Logo */}
      <Flex justify="center" mb={4} w="full" opacity={0.6}>
        <Logo size="lg" />
      </Flex>

      {/* Icon */}
      <Flex justify="center" mb={6}>
        <Box
          w={20}
          h={20}
          bg="rgba(6, 182, 212, 0.1)"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <LuMail size={40} color="#06B6D4" />
        </Box>
      </Flex>

      {/* Content */}
      <VStack gap={3} mb={8} textAlign="center">
        <Heading size="md" color="text.primary">
          Check your email
        </Heading>
        <Text color="text.secondary" fontSize="sm" maxW="300px" mx="auto">
          We sent you a magic link to sign in. Click the link in your email to
          continue.
        </Text>
      </VStack>

      {/* Tips */}
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.muted"
        borderRadius="xl"
        p={4}
        mb={6}
      >
        <VStack gap={2} align="start">
          <Text color="text.secondary" fontSize="sm" fontWeight="medium">
            Didn't receive the email?
          </Text>
          <Text color="text.tertiary" fontSize="sm">
            • Check your spam folder
          </Text>
          <Text color="text.tertiary" fontSize="sm">
            • Make sure you entered the correct email
          </Text>
          <Text color="text.tertiary" fontSize="sm">
            • The link expires in 24 hours
          </Text>
        </VStack>
      </Box>

      {/* Back to login */}
      <Link
        asChild
        _hover={{ textDecoration: 'none' }}
        _focus={{ outline: 'none', boxShadow: 'none' }}
      >
        <NextLink href="/login">
          <Button
            w="full"
            variant="outline"
            size="lg"
            borderColor="border.default"
            color="text.secondary"
            px={4}
            _hover={{ bg: 'bg.hover', borderColor: 'border.default' }}
          >
            <LuArrowLeft size={18} />
            <Text>Back to sign in</Text>
          </Button>
        </NextLink>
      </Link>
    </Box>
  );
}
