'use client';

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  Image,
} from '@chakra-ui/react';
import { LuCalendar, LuFileText, LuShield, LuUser } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';

interface ReportData {
  reportId: string;
  title: string | null;
  dateFrom: string;
  dateTo: string;
  totalIncome: number;
  totalVerified: number;
  transactionCount: number;
  createdAt: string;
  user: {
    displayName: string | null;
    name: string | null;
  };
}

interface VerifyClientProps {
  report: ReportData;
}

export default function VerifyClient({ report }: VerifyClientProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const verificationRate =
    report.transactionCount > 0
      ? Math.round((report.totalVerified / report.totalIncome) * 100)
      : 0;

  const userName = report.user.name || 'Account Holder';

  return (
    <Box minH="100vh" bg="bg.canvas" py={12} px={4}>
      <Box maxW="600px" mx="auto">
        {/* Header with Logo */}
        <VStack gap={4} mb={8} textAlign="center">
          <Image
            src="/images/logo-full.svg"
            alt="Provalo"
            h="40px"
            filter="brightness(0) invert(1)"
          />
          <Badge
            bg="green.500/15"
            color="green.400"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            <HStack gap={2}>
              <FaCheckCircle size={14} />
              <Text>Verified Report</Text>
            </HStack>
          </Badge>
        </VStack>

        {/* Report Card with shadow */}
        <Box
          bg="bg.surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.muted"
          overflow="hidden"
          boxShadow="0 4px 24px rgba(0, 0, 0, 0.3)"
        >
          {/* Green header bar */}
          <Box h="4px" bg="green.500" />

          <Box p={6}>
            {/* Report Title */}
            <VStack align="start" gap={1} mb={3}>
              <Text
                fontSize="xs"
                color="text.tertiary"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Income Verification Report
              </Text>
              <Text fontSize="xl" fontWeight="700" color="text.primary">
                {report.title || 'Income Report'}
              </Text>
            </VStack>

            {/* Compact info row */}
            <Flex
              gap={3}
              mb={5}
              fontSize="sm"
              color="text.secondary"
              flexWrap="wrap"
              align="center"
            >
              <HStack gap={1}>
                <LuUser size={14} />
                <Text fontWeight="500" color="text.primary">
                  {userName}
                </Text>
              </HStack>
              <Text color="text.tertiary">·</Text>
              <HStack gap={1}>
                <LuCalendar size={14} />
                <Text>
                  {formatDate(report.dateFrom)} — {formatDate(report.dateTo)}
                </Text>
              </HStack>
              <Text color="text.tertiary">·</Text>
              <Badge
                bg="bg.elevated"
                color="text.secondary"
                px={2}
                py={0.5}
                borderRadius="md"
                fontFamily="mono"
                fontSize="xs"
              >
                {report.reportId}
              </Badge>
            </Flex>

            {/* Summary Stats */}
            <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={5}>
              <Box p={3} bg="bg.canvas" borderRadius="lg" textAlign="center">
                <Text
                  fontSize="xs"
                  color="text.tertiary"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={1}
                >
                  Total Income
                </Text>
                <Text fontSize="lg" fontWeight="700" color="green.400">
                  {formatCurrency(report.totalIncome)}
                </Text>
              </Box>
              <Box p={3} bg="bg.canvas" borderRadius="lg" textAlign="center">
                <Text
                  fontSize="xs"
                  color="text.tertiary"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={1}
                >
                  Verified Income
                </Text>
                <Text fontSize="lg" fontWeight="700" color="primary.400">
                  {formatCurrency(report.totalVerified)}
                </Text>
              </Box>
              <Box p={3} bg="bg.canvas" borderRadius="lg" textAlign="center">
                <Text
                  fontSize="xs"
                  color="text.tertiary"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={1}
                >
                  Transactions
                </Text>
                <Text fontSize="lg" fontWeight="700" color="text.primary">
                  {report.transactionCount}
                </Text>
              </Box>
              <Box p={3} bg="bg.canvas" borderRadius="lg" textAlign="center">
                <Text
                  fontSize="xs"
                  color="text.tertiary"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={1}
                >
                  Verification Rate
                </Text>
                <Text fontSize="lg" fontWeight="700" color="text.primary">
                  {verificationRate}%
                </Text>
              </Box>
            </Grid>

            {/* Generation info */}
            <Box pt={4} borderTop="1px solid" borderColor="border.muted">
              <Flex
                justify="space-between"
                color="text.tertiary"
                fontSize="sm"
                direction={{ base: 'column', sm: 'row' }}
                gap={2}
              >
                <HStack gap={2}>
                  <LuFileText size={14} />
                  <Text>Generated {formatDate(report.createdAt)}</Text>
                </HStack>
                <HStack gap={2}>
                  <LuShield size={14} />
                  <Text>Blockchain Verified</Text>
                </HStack>
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <VStack mt={8} gap={2} textAlign="center">
          <Text fontSize="sm" color="text.tertiary">
            This report was generated by Provalo and verified against blockchain
            data.
          </Text>
          <Text fontSize="xs" color="text.tertiary">
            © {new Date().getFullYear()} Provalo · provalo.io
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
