'use client';

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Grid,
  Container,
  Link as ChakraLink,
} from '@chakra-ui/react';
import {
  LuWallet,
  LuShieldCheck,
  LuFileText,
  LuArrowRight,
  LuCheck,
} from 'react-icons/lu';
import NextLink from 'next/link';
import { Logo } from '@/components/ui/Logo';

// Feature card component
function FeatureCard({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <Flex
      direction="column"
      p={6}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="16px"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.06)"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        bg: 'rgba(255, 255, 255, 0.04)',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        transform: 'translateY(-4px)',
      }}
    >
      {/* Step number */}
      <Text
        fontSize="xs"
        fontWeight="600"
        color="primary.500"
        letterSpacing="0.1em"
        textTransform="uppercase"
        mb={4}
      >
        {step}
      </Text>

      {/* Icon */}
      <Flex
        w={11}
        h={11}
        bg="rgba(6, 182, 212, 0.1)"
        border="1px solid"
        borderColor="rgba(6, 182, 212, 0.2)"
        borderRadius="12px"
        align="center"
        justify="center"
        mb={4}
      >
        <Icon size={20} color="#06B6D4" />
      </Flex>

      {/* Content */}
      <Text fontWeight="600" fontSize="md" color="white" mb={2}>
        {title}
      </Text>
      <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" lineHeight="1.7">
        {description}
      </Text>
    </Flex>
  );
}

// Use case pill
function UseCasePill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <Flex
      align="center"
      gap={2}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="full"
      px={4}
      py={2}
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.06)"
      transition="all 0.2s"
      _hover={{
        bg: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Text fontSize="lg">{emoji}</Text>
      <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" fontWeight="500">
        {label}
      </Text>
    </Flex>
  );
}

// Trust badge
function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <HStack gap={2} color="rgba(255, 255, 255, 0.4)" fontSize="sm">
      <Box color="primary.500">
        <LuCheck size={14} strokeWidth={3} />
      </Box>
      <Text>{children}</Text>
    </HStack>
  );
}

export default function HomePage() {
  return (
    <Box bg="#050505" minH="100vh" color="white" position="relative">
      {/* Subtle gradient background */}
      <Box
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        width="100%"
        maxW="1200px"
        height="600px"
        background="radial-gradient(ellipse at top, rgba(6, 182, 212, 0.08) 0%, transparent 60%)"
        pointerEvents="none"
      />

      {/* Navigation */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bg="rgba(5, 5, 5, 0.8)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="rgba(255, 255, 255, 0.05)"
      >
        <Container maxW="5xl">
          <Flex h={16} align="center" justify="space-between">
            <Logo size="sm" />

            <HStack gap={2}>
              <Button
                asChild
                variant="ghost"
                color="rgba(255, 255, 255, 0.6)"
                size="sm"
                fontWeight="500"
                _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.05)' }}
              >
                <NextLink href="/login">Sign In</NextLink>
              </Button>
              <Button
                asChild
                bg="primary.500"
                color="white"
                size="sm"
                fontWeight="600"
                _hover={{ bg: 'primary.400' }}
              >
                <NextLink href="/register">Get Started</NextLink>
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        pt={{ base: 32, md: 44 }}
        pb={{ base: 20, md: 32 }}
        position="relative"
      >
        <Container maxW="3xl">
          <Flex direction="column" align="center" textAlign="center" gap={6}>
            {/* Headline */}
            <Text
              fontSize={{ base: '2.5rem', sm: '3rem', md: '3.75rem' }}
              fontWeight="700"
              lineHeight="1.1"
              letterSpacing="-0.04em"
              color="white"
            >
              Prove your{' '}
              <Text as="span" color="primary.400" position="relative">
                crypto income
              </Text>
            </Text>

            {/* Subheadline */}
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="rgba(255, 255, 255, 0.5)"
              maxW="md"
              lineHeight="1.8"
              fontWeight="400"
            >
              Turn blockchain transactions into verified financial documents
              that banks, landlords, and institutions actually trust.
            </Text>

            {/* CTA */}
            <Box pt={4}>
              <Button
                asChild
                bg="white"
                color="#0a0a0a"
                size="lg"
                px={8}
                h={12}
                fontSize="sm"
                fontWeight="600"
                borderRadius="full"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(6, 182, 212, 0.3)',
                }}
                transition="all 0.2s ease"
              >
                <NextLink href="/register">
                  Start for free
                  <LuArrowRight style={{ marginLeft: 8 }} />
                </NextLink>
              </Button>
            </Box>

            {/* Trust badges */}
            <HStack
              gap={{ base: 4, md: 8 }}
              pt={8}
              flexWrap="wrap"
              justify="center"
            >
              <TrustBadge>No private keys needed</TrustBadge>
              <TrustBadge>2 free reports/month</TrustBadge>
              <TrustBadge>Multi-chain support</TrustBadge>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="4xl">
          <Flex direction="column" align="center" gap={12}>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="rgba(255, 255, 255, 0.4)"
              letterSpacing="0.15em"
              textTransform="uppercase"
            >
              How it works
            </Text>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={5}
              w="full"
            >
              <FeatureCard
                icon={LuWallet}
                step="Step 1"
                title="Connect your wallet"
                description="Sign a message to link your wallet. We fetch your incoming transactions automatically."
              />
              <FeatureCard
                icon={LuShieldCheck}
                step="Step 2"
                title="Verify your senders"
                description="Request verification from payers. Verified payments get labeled automatically."
              />
              <FeatureCard
                icon={LuFileText}
                step="Step 3"
                title="Generate reports"
                description="Create professional PDFs with QR verification codes for instant authenticity checks."
              />
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Use Cases */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="3xl">
          <Flex direction="column" align="center" gap={8}>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="rgba(255, 255, 255, 0.4)"
              letterSpacing="0.15em"
              textTransform="uppercase"
            >
              Built for
            </Text>

            <Flex flexWrap="wrap" gap={3} justify="center">
              <UseCasePill emoji="🌍" label="Visa applications" />
              <UseCasePill emoji="🏠" label="Rental applications" />
              <UseCasePill emoji="🏦" label="Loan applications" />
              <UseCasePill emoji="📊" label="Tax documentation" />
              <UseCasePill emoji="💼" label="Employment verification" />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 20, md: 32 }}>
        <Container maxW="2xl">
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={6}
            p={{ base: 10, md: 14 }}
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="24px"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.06)"
            position="relative"
            overflow="hidden"
          >
            {/* Subtle glow */}
            <Box
              position="absolute"
              top="-50%"
              left="50%"
              transform="translateX(-50%)"
              width="400px"
              height="400px"
              background="radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)"
              pointerEvents="none"
            />

            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="600"
              position="relative"
            >
              Ready to prove your income?
            </Text>
            <Text
              color="rgba(255, 255, 255, 0.5)"
              fontSize="sm"
              maxW="sm"
              position="relative"
            >
              Join crypto freelancers, DAO contributors, and remote workers who
              document their income with Provalo.
            </Text>
            <Button
              asChild
              bg="primary.500"
              color="white"
              size="lg"
              px={8}
              fontWeight="600"
              borderRadius="full"
              _hover={{ bg: 'primary.400' }}
              position="relative"
            >
              <NextLink href="/register">Get started free</NextLink>
            </Button>
            <Text
              fontSize="xs"
              color="rgba(255, 255, 255, 0.3)"
              position="relative"
            >
              No credit card required
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={8} borderTop="1px solid" borderColor="rgba(255, 255, 255, 0.05)">
        <Container maxW="5xl">
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Logo size="sm" />

            <HStack gap={6} color="rgba(255, 255, 255, 0.4)" fontSize="sm">
              <ChakraLink asChild _hover={{ color: 'white' }}>
                <NextLink href="/login">Sign In</NextLink>
              </ChakraLink>
              <Text>© {new Date().getFullYear()} Provalo</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
