'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  HStack,
  Separator,
} from '@chakra-ui/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Logo } from '@/components/ui/Logo';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/wallets';
  const error = searchParams.get('error');

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading('email');
    // In dev mode, nodemailer provider is used; in prod, resend
    // We try nodemailer first, fallback to resend
    await signIn('nodemailer', { email: data.email, callbackUrl });
  };

  return (
    <Box>
      {/* Logo */}
      <Flex justify="center" mb={4} w="full" opacity={0.6}>
        <Logo size="lg" />
      </Flex>

      {/* Header */}
      <VStack gap={2} mb={8} textAlign="center">
        <Heading size="md" color="text.primary">
          Sign in to Provalo
        </Heading>
        <Text color="dark.400" fontSize="sm">
          Welcome back! Please sign in to continue
        </Text>
      </VStack>

      {/* Error message */}
      {error && (
        <Box
          bg="rgba(239, 68, 68, 0.1)"
          border="1px solid rgba(239, 68, 68, 0.3)"
          borderRadius="xl"
          p={3}
          mb={6}
        >
          <Text color="#ef4444" fontSize="sm" textAlign="center">
            {error === 'OAuthAccountNotLinked'
              ? 'This email is already associated with another account.'
              : error === 'CredentialsSignin'
                ? 'Invalid credentials. Please try again.'
                : error === 'Verification'
                  ? 'The magic link has expired or already been used. Please request a new one.'
                  : error === 'Configuration'
                    ? 'There is a problem with the server configuration.'
                    : `An error occurred: ${error}`}
          </Text>
        </Box>
      )}

      {/* OAuth Providers */}
      <VStack gap={3} mb={6}>
        <HStack gap={3} w="full">
          <Button
            flex={1}
            variant="outline"
            size="lg"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading !== null}
          >
            <FaGithub />
            <Text>GitHub</Text>
          </Button>

          <Button
            flex={1}
            variant="outline"
            size="lg"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading !== null}
          >
            <FaGoogle />
            <Text>Google</Text>
          </Button>
        </HStack>
      </VStack>

      {/* Divider */}
      <HStack gap={4} mb={6}>
        <Separator flex={1} borderColor="border.default" />
        <Text color="text.tertiary" fontSize="sm">
          or
        </Text>
        <Separator flex={1} borderColor="border.default" />
      </HStack>

      {/* Email Sign In */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4}>
          <Box w="full">
            <Text color="text.secondary" fontSize="sm" mb={2}>
              Email address
            </Text>
            <Input
              type="email"
              placeholder="Enter your email"
              size="lg"
              {...register('email')}
            />
            {errors.email && (
              <Text color="error.500" fontSize="xs" mt={1}>
                {errors.email.message}
              </Text>
            )}
          </Box>

          <Button
            type="submit"
            w="full"
            size="lg"
            bg="white"
            color="bg.canvas"
            _hover={{ bg: 'gray.100' }}
            _active={{ bg: 'gray.200' }}
            disabled={isLoading !== null}
          >
            {isLoading === 'email' ? (
              <Text>Sending magic link...</Text>
            ) : (
              <>
                <Text>Continue with Email</Text>
                <Text>→</Text>
              </>
            )}
          </Button>
        </VStack>
      </form>

      {/* Register link */}
      <Text color="text.tertiary" fontSize="sm" textAlign="center" mt={8}>
        Don't have an account?{' '}
        <Link
          asChild
          color="text.primary"
          fontWeight="medium"
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <NextLink href="/register">Sign up</NextLink>
        </Link>
      </Text>
    </Box>
  );
}
