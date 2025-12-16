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
  Highlight,
} from '@chakra-ui/react';
import {
  LuWallet,
  LuShieldCheck,
  LuFileText,
  LuArrowRight,
  LuCheck,
  LuZap,
} from 'react-icons/lu';
import NextLink from 'next/link';
import { Logo } from '@/components/ui/Logo';

// Animated gradient orb
function GradientOrb() {
  return (
    <Box
      position="absolute"
      top={{ base: '-10%', md: '-20%' }}
      left="50%"
      transform="translateX(-50%)"
      width={{ base: '400px', md: '800px' }}
      height={{ base: '400px', md: '800px' }}
      borderRadius="full"
      background="radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 30%, transparent 60%)"
      filter="blur(60px)"
      pointerEvents="none"
    />
  );
}

// Feature card with number
function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="20px"
      border="1px solid rgba(255, 255, 255, 0.06)"
      position="relative"
      overflow="hidden"
      transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
      _hover={{
        bg: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
      role="group"
    >
      {/* Large background number */}
      <Text
        position="absolute"
        top="-10px"
        right="10px"
        fontSize={{ base: '80px', md: '120px' }}
        fontWeight="800"
        color="rgba(255, 255, 255, 0.02)"
        lineHeight="1"
        userSelect="none"
        transition="all 0.4s ease"
        _groupHover={{
          color: 'rgba(6, 182, 212, 0.08)',
        }}
      >
        {number}
      </Text>

      {/* Icon */}
      <Flex
        w={{ base: 10, md: 12 }}
        h={{ base: 10, md: 12 }}
        bg="rgba(6, 182, 212, 0.1)"
        border="1px solid rgba(6, 182, 212, 0.2)"
        borderRadius="14px"
        align="center"
        justify="center"
        mb={{ base: 4, md: 5 }}
        transition="all 0.3s ease"
        _groupHover={{
          bg: 'rgba(6, 182, 212, 0.15)',
          transform: 'scale(1.05)',
        }}
      >
        <Icon size={22} color="#06B6D4" />
      </Flex>

      {/* Content */}
      <Text
        fontWeight="600"
        fontSize={{ base: 'md', md: 'lg' }}
        color="white"
        mb={2}
      >
        {title}
      </Text>
      <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" lineHeight="1.7">
        {description}
      </Text>
    </Box>
  );
}

// Use case tag
function UseCaseTag({ emoji, label }: { emoji: string; label: string }) {
  return (
    <Flex
      align="center"
      gap={2}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="full"
      px={{ base: 4, md: 5 }}
      py={2.5}
      border="1px solid rgba(255, 255, 255, 0.08)"
      transition="all 0.3s ease"
      cursor="default"
      _hover={{
        bg: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        transform: 'translateY(-2px)',
      }}
    >
      <Text fontSize={{ base: 'md', md: 'lg' }}>{emoji}</Text>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        color="rgba(255, 255, 255, 0.8)"
        fontWeight="500"
      >
        {label}
      </Text>
    </Flex>
  );
}

// Stat display
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Flex direction="column" align="center" gap={1}>
      <Text
        fontSize={{ base: 'xl', md: '3xl' }}
        fontWeight="700"
        color="primary.400"
        letterSpacing="-0.02em"
      >
        {value}
      </Text>
      <Text
        fontSize={{ base: '2xs', md: 'xs' }}
        color="rgba(255, 255, 255, 0.4)"
        textTransform="uppercase"
        letterSpacing="0.1em"
        textAlign="center"
      >
        {label}
      </Text>
    </Flex>
  );
}

// Smooth scroll function
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage() {
  return (
    <Box
      bg="#030303"
      minH="100vh"
      color="white"
      position="relative"
      overflow="hidden"
    >
      {/* Background elements */}
      <GradientOrb />

      {/* Grid pattern overlay */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)"
        backgroundSize={{ base: '40px 40px', md: '60px 60px' }}
        pointerEvents="none"
        opacity={0.5}
      />

      {/* Navigation */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bg="rgba(3, 3, 3, 0.8)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid rgba(255, 255, 255, 0.05)"
      >
        <Container maxW="6xl" px={{ base: 4, md: 6 }}>
          <Flex h={{ base: 14, md: 16 }} align="center" justify="space-between">
            <Logo size="sm" />

            <HStack gap={{ base: 2, md: 3 }}>
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
                bg="white"
                color="#030303"
                size="sm"
                fontWeight="600"
                _hover={{ bg: 'rgba(255, 255, 255, 0.9)' }}
              >
                <NextLink href="/register">Get Started</NextLink>
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        pt={{ base: 28, md: 44 }}
        pb={{ base: 12, md: 24 }}
        position="relative"
      >
        <Container maxW="4xl" px={{ base: 4, md: 6 }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={{ base: 6, md: 8 }}
          >
            {/* Badge */}
            <Flex
              align="center"
              gap={2}
              bg="rgba(6, 182, 212, 0.1)"
              border="1px solid rgba(6, 182, 212, 0.2)"
              borderRadius="full"
              px={{ base: 3, md: 4 }}
              py={1.5}
            >
              <LuZap size={14} color="#06B6D4" />
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                color="primary.400"
                fontWeight="500"
              >
                Trusted by crypto professionals
              </Text>
            </Flex>

            {/* Headline */}
            <Text
              fontSize={{
                base: '2.5rem',
                sm: '3.5rem',
                md: '4.5rem',
                lg: '5rem',
              }}
              fontWeight="800"
              lineHeight="1.05"
              letterSpacing="-0.04em"
              color="white"
            >
              <Highlight query="proof" styles={{ color: 'primary.400' }}>
                Turn crypto into proof
              </Highlight>
            </Text>

            {/* Subheadline */}
            <Text
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
              color="rgba(255, 255, 255, 0.5)"
              maxW="lg"
              lineHeight="1.7"
              fontWeight="400"
              px={{ base: 2, md: 0 }}
            >
              Transform blockchain transactions into verified financial
              documents that institutions actually trust.
            </Text>

            {/* CTA Buttons */}
            <Flex
              gap={{ base: 3, md: 4 }}
              pt={{ base: 2, md: 4 }}
              flexWrap="wrap"
              justify="center"
              direction={{ base: 'column', sm: 'row' }}
              w={{ base: 'full', sm: 'auto' }}
              px={{ base: 4, sm: 0 }}
            >
              <Button
                asChild
                bg="white"
                color="#030303"
                size={{ base: 'lg', md: 'lg' }}
                px={{ base: 6, md: 8 }}
                h={{ base: 12, md: 14 }}
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="600"
                borderRadius="full"
                w={{ base: 'full', sm: 'auto' }}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
                }}
                transition="all 0.3s ease"
              >
                <NextLink href="/register">
                  Start for free
                  <LuArrowRight style={{ marginLeft: 8 }} />
                </NextLink>
              </Button>
              <Button
                onClick={() => scrollToSection('how-it-works')}
                variant="outline"
                size={{ base: 'lg', md: 'lg' }}
                px={{ base: 6, md: 8 }}
                h={{ base: 12, md: 14 }}
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="500"
                borderRadius="full"
                border="1px solid rgba(255, 255, 255, 0.15)"
                color="white"
                w={{ base: 'full', sm: 'auto' }}
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                See how it works
              </Button>
            </Flex>

            {/* Trust indicators */}
            <Flex
              gap={{ base: 3, md: 8 }}
              pt={{ base: 6, md: 8 }}
              color="rgba(255, 255, 255, 0.4)"
              fontSize={{ base: 'xs', md: 'sm' }}
              flexWrap="wrap"
              justify="center"
            >
              <HStack gap={2}>
                <LuCheck size={16} color="#06B6D4" />
                <Text>No private keys</Text>
              </HStack>
              <HStack gap={2}>
                <LuCheck size={16} color="#06B6D4" />
                <Text>Free reports</Text>
              </HStack>
              <HStack gap={2}>
                <LuCheck size={16} color="#06B6D4" />
                <Text>Multi-chain</Text>
              </HStack>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        py={{ base: 10, md: 16 }}
        borderY="1px solid rgba(255, 255, 255, 0.05)"
      >
        <Container maxW="4xl" px={{ base: 4, md: 6 }}>
          <Grid templateColumns="repeat(4, 1fr)" gap={{ base: 4, md: 8 }}>
            <Stat value="10K+" label="Reports" />
            <Stat value="$50M+" label="Verified" />
            <Stat value="500+" label="Senders" />
            <Stat value="99.9%" label="Uptime" />
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box py={{ base: 16, md: 32 }} id="how-it-works">
        <Container maxW="5xl" px={{ base: 4, md: 6 }}>
          <Flex direction="column" align="center" gap={{ base: 10, md: 16 }}>
            <Flex direction="column" align="center" gap={4} textAlign="center">
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight="600"
                color="primary.500"
                letterSpacing="0.15em"
                textTransform="uppercase"
              >
                How it works
              </Text>
              <Text
                fontSize={{ base: 'xl', md: '3xl' }}
                fontWeight="700"
                color="white"
                letterSpacing="-0.02em"
              >
                Three steps to verified income
              </Text>
            </Flex>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: 4, md: 6 }}
              w="full"
            >
              <FeatureCard
                icon={LuWallet}
                number="1"
                title="Connect wallet"
                description="Sign a message to link your wallet. We automatically fetch all incoming transactions."
              />
              <FeatureCard
                icon={LuShieldCheck}
                number="2"
                title="Verify senders"
                description="Request verification from payers. Verified payments are auto-labeled with company info."
              />
              <FeatureCard
                icon={LuFileText}
                number="3"
                title="Generate reports"
                description="Create professional PDFs with QR codes for instant verification by any institution."
              />
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Use Cases */}
      <Box py={{ base: 16, md: 28 }} bg="rgba(255, 255, 255, 0.01)">
        <Container maxW="4xl" px={{ base: 4, md: 6 }}>
          <Flex direction="column" align="center" gap={{ base: 8, md: 12 }}>
            <Flex direction="column" align="center" gap={4} textAlign="center">
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight="600"
                color="primary.500"
                letterSpacing="0.15em"
                textTransform="uppercase"
              >
                Use cases
              </Text>
              <Text
                fontSize={{ base: 'xl', md: '3xl' }}
                fontWeight="700"
                color="white"
                letterSpacing="-0.02em"
              >
                Perfect for any verification
              </Text>
            </Flex>

            <Flex flexWrap="wrap" gap={3} justify="center">
              <UseCaseTag emoji="🌍" label="Visa Applications" />
              <UseCaseTag emoji="🏠" label="Rental Applications" />
              <UseCaseTag emoji="🏦" label="Loan Applications" />
              <UseCaseTag emoji="📊" label="Tax Documentation" />
              <UseCaseTag emoji="💼" label="Employment Verification" />
              <UseCaseTag emoji="🎓" label="Student Visas" />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box py={{ base: 16, md: 32 }}>
        <Container maxW="3xl" px={{ base: 4, md: 6 }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={{ base: 6, md: 8 }}
            p={{ base: 8, md: 16 }}
            bg="rgba(6, 182, 212, 0.05)"
            borderRadius={{ base: '24px', md: '32px' }}
            border="1px solid rgba(6, 182, 212, 0.15)"
            position="relative"
            overflow="hidden"
          >
            {/* Glow effect */}
            <Box
              position="absolute"
              top="0"
              left="50%"
              transform="translateX(-50%)"
              width="100%"
              height="200px"
              background="radial-gradient(ellipse at top, rgba(6, 182, 212, 0.2) 0%, transparent 70%)"
              pointerEvents="none"
            />

            <Text
              fontSize={{ base: 'xl', md: '3xl' }}
              fontWeight="700"
              position="relative"
              letterSpacing="-0.02em"
            >
              Ready to prove your income?
            </Text>
            <Text
              color="rgba(255, 255, 255, 0.6)"
              fontSize={{ base: 'sm', md: 'md' }}
              maxW="md"
              position="relative"
              lineHeight="1.7"
              px={{ base: 2, md: 0 }}
            >
              Join thousands of crypto professionals who trust Provalo for their
              financial documentation needs.
            </Text>
            <Button
              asChild
              bg="white"
              color="#030303"
              size="lg"
              px={{ base: 8, md: 10 }}
              h={{ base: 12, md: 14 }}
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="600"
              borderRadius="full"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)',
              }}
              transition="all 0.3s ease"
              position="relative"
            >
              <NextLink href="/register">
                Get started free
                <LuArrowRight style={{ marginLeft: 8 }} />
              </NextLink>
            </Button>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color="rgba(255, 255, 255, 0.4)"
              position="relative"
            >
              No credit card required · 2 free reports/month
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        py={{ base: 6, md: 8 }}
        borderTop="1px solid rgba(255, 255, 255, 0.05)"
      >
        <Container maxW="6xl" px={{ base: 4, md: 6 }}>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Logo size="sm" />

            <HStack
              gap={{ base: 4, md: 8 }}
              color="rgba(255, 255, 255, 0.4)"
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              <ChakraLink asChild _hover={{ color: 'white' }}>
                <NextLink href="/privacy">Privacy</NextLink>
              </ChakraLink>
              <ChakraLink asChild _hover={{ color: 'white' }}>
                <NextLink href="/terms">Terms</NextLink>
              </ChakraLink>
              <Text>© {new Date().getFullYear()} Provalo</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
