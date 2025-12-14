'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Separator,
  Code,
} from '@chakra-ui/react';
import { logger } from '@/utils/logging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to your error tracking service
    logger.error('ErrorBoundary caught an error', {
      component: 'ErrorBoundary',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      errorCount: this.state.errorCount + 1,
    });

    // Update state
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // If too many errors, prevent infinite loop
    if (this.state.errorCount >= 3) {
      logger.error('Too many errors caught, preventing retry', {
        component: 'ErrorBoundary',
        errorCount: this.state.errorCount,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      const tooManyErrors = this.state.errorCount >= 3;

      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.950"
          p={4}
        >
          <VStack gap={6} maxW="2xl" w="full" textAlign="center">
            {/* Error Icon */}
            <Box
              w={20}
              h={20}
              rounded="full"
              bg="red.900"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="4xl">⚠️</Text>
            </Box>

            {/* Error Title */}
            <VStack gap={2}>
              <Heading color="red.400" fontSize="3xl">
                {tooManyErrors ? 'Critical Error' : 'Something went wrong'}
              </Heading>
              <Text color="gray.400" fontSize="md">
                {tooManyErrors
                  ? 'Multiple errors detected. Please reload the page or contact support.'
                  : 'We encountered an unexpected error. Please try again.'}
              </Text>
            </VStack>

            {/* Error Message */}
            <Box
              p={4}
              bg="gray.900"
              rounded="lg"
              w="full"
              borderWidth="1px"
              borderColor="red.900"
            >
              <Text
                fontSize="sm"
                color="red.300"
                fontFamily="mono"
                textAlign="left"
              >
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>
            </Box>

            {/* Error Details (Development Only) */}
            {isDevelopment && (
              <>
                <Separator />

                <VStack gap={4} w="full" align="stretch">
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Error Details (Development Only)
                  </Text>

                  {/* Stack Trace */}
                  {this.state.error?.stack && (
                    <Box
                      p={4}
                      bg="gray.900"
                      rounded="md"
                      maxH="300px"
                      overflow="auto"
                      borderWidth="1px"
                      borderColor="gray.800"
                    >
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        Stack Trace:
                      </Text>
                      <Code
                        fontSize="xs"
                        color="red.300"
                        display="block"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {this.state.error.stack}
                      </Code>
                    </Box>
                  )}

                  {/* Component Stack */}
                  {this.state.errorInfo?.componentStack && (
                    <Box
                      p={4}
                      bg="gray.900"
                      rounded="md"
                      maxH="200px"
                      overflow="auto"
                      borderWidth="1px"
                      borderColor="gray.800"
                    >
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        Component Stack:
                      </Text>
                      <Code
                        fontSize="xs"
                        color="yellow.300"
                        display="block"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {this.state.errorInfo.componentStack}
                      </Code>
                    </Box>
                  )}
                </VStack>
              </>
            )}

            <Separator />

            {/* Action Buttons */}
            <VStack gap={3} w="full">
              {!tooManyErrors && (
                <Button
                  onClick={this.handleReset}
                  colorPalette="blue"
                  size="lg"
                  w="full"
                >
                  Try Again
                </Button>
              )}

              <HStack w="full" gap={3}>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  colorPalette="gray"
                  size="md"
                  flex={1}
                >
                  Reload Page
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  colorPalette="gray"
                  size="md"
                  flex={1}
                >
                  Go Home
                </Button>
              </HStack>
            </VStack>

            {/* Help Text */}
            <Text fontSize="sm" color="gray.500">
              If this problem persists, please contact support
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
