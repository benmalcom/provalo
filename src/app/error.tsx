// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  Container,
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry with additional context
  }, [error]);

  return (
    <Box
      minH="100vh"
      bg="gray.900"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <VStack gap={6} textAlign="center">
          <Icon as={FaExclamationTriangle} boxSize={16} color="red.400" />
          <Heading size="xl" color="red.400">
            Oops! Something went wrong
          </Heading>
          <Text color="whiteAlpha.700" fontSize="lg">
            We've been notified about this error and will fix it soon.
          </Text>
          {error.digest && (
            <Text color="whiteAlpha.500" fontSize="sm">
              Error ID: {error.digest}
            </Text>
          )}
          <VStack gap={3}>
            <Button
              bg="#6878FF"
              color="white"
              _hover={{ bg: '#5A6CFF' }}
              _active={{ bg: '#4A5DFE' }}
              size="lg"
              onClick={reset}
            >
              <Icon as={FaRedo} />
              Try again
            </Button>
            <Button
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              size="sm"
              onClick={() => (window.location.href = '/')}
            >
              Go to Homepage
            </Button>
          </VStack>

          {/* Additional helpful info */}
          <Box
            mt={6}
            p={4}
            bg="rgba(255, 255, 255, 0.05)"
            borderRadius="md"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <Text fontSize="sm" color="whiteAlpha.600" mb={2}>
              If this problem persists, try:
            </Text>
            <VStack gap={1} fontSize="xs" color="whiteAlpha.500">
              <Text>• Refreshing the page</Text>
              <Text>• Clearing your browser cache</Text>
              <Text>• Checking your internet connection</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
