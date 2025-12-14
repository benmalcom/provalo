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

const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/wallets';
  const error = searchParams.get('error');

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading('email');
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
        <Heading size="lg" color="text.primary">
          Create your account
        </Heading>
        <Text color="gray.400" fontSize="sm">
          Start converting crypto income into verified documents
        </Text>
      </VStack>

      {/* Error message */}
      {error && (
        <Box
          bg="error.500/10"
          border="1px solid"
          borderColor="error.500/30"
          borderRadius="xl"
          p={3}
          mb={6}
        >
          <Text color="error.500" fontSize="sm" textAlign="center">
            {error === 'OAuthAccountNotLinked'
              ? 'This email is already associated with another account.'
              : 'An error occurred. Please try again.'}
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

      {/* Email Sign Up */}
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
              <Text>Sending link...</Text>
            ) : (
              <>
                <Text>Continue</Text>
                <Text>→</Text>
              </>
            )}
          </Button>
        </VStack>
      </form>

      {/* Terms notice */}
      <Text color="text.tertiary" fontSize="xs" textAlign="center" mt={6}>
        By signing up, you agree to our{' '}
        <Link
          asChild
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <NextLink href="/terms">Terms of Service</NextLink>
        </Link>{' '}
        and{' '}
        <Link
          asChild
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <NextLink href="/privacy">Privacy Policy</NextLink>
        </Link>
      </Text>

      {/* Login link */}
      <Text color="text.tertiary" fontSize="sm" textAlign="center" mt={6}>
        Already have an account?{' '}
        <Link
          asChild
          color="text.primary"
          fontWeight="medium"
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <NextLink href="/login">Sign in</NextLink>
        </Link>
      </Text>
    </Box>
  );
}
