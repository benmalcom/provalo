'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Badge,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuFileText,
  LuDownload,
  LuExternalLink,
  LuCalendar,
} from 'react-icons/lu';
import { Header } from '@/components/layout';

// Mock data
const mockReports = [
  {
    id: '1',
    reportId: 'PV-2024-X7K9M2',
    title: 'Q4 2024 Income Report',
    dateFrom: new Date('2024-10-01'),
    dateTo: new Date('2024-12-31'),
    totalIncome: 12500.0,
    totalVerified: 10000.0,
    transactionCount: 8,
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '2',
    reportId: 'PV-2024-A3B2C1',
    title: 'November 2024',
    dateFrom: new Date('2024-11-01'),
    dateTo: new Date('2024-11-30'),
    totalIncome: 4500.0,
    totalVerified: 4500.0,
    transactionCount: 3,
    createdAt: new Date('2024-12-01'),
  },
];

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatDateRange = (from: Date, to: Date) => {
    return `${formatDate(from)} - ${formatDate(to)}`;
  };

  return (
    <Box>
      <Header title="Reports" />

      <Box p={6}>
        {/* Generate new report */}
        <Box
          bg="bg.surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.muted"
          p={6}
          mb={6}
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text fontWeight="600" color="text.primary">
                Generate New Report
              </Text>
              <Text fontSize="sm" color="text.secondary">
                Create a verified income report for banks, landlords, or
                immigration.
              </Text>
            </VStack>
            <Button
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              disabled={isGenerating}
            >
              <HStack gap={2}>
                <LuPlus size={18} />
                <Text>New Report</Text>
              </HStack>
            </Button>
          </Flex>
        </Box>

        {/* Report list */}
        {mockReports.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={16}
            px={6}
            bg="bg.surface"
            borderRadius="xl"
            border="1px dashed"
            borderColor="border.default"
          >
            <Box
              w={16}
              h={16}
              bg="primary.500/10"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <LuFileText size={32} color="var(--chakra-colors-primary-500)" />
            </Box>

            <Text fontSize="lg" fontWeight="600" color="text.primary" mb={2}>
              No reports yet
            </Text>
            <Text color="text.secondary" textAlign="center" maxW="sm">
              Generate your first income report to share with institutions.
            </Text>
          </Flex>
        ) : (
          <VStack gap={4} align="stretch">
            <Text fontSize="sm" color="text.secondary">
              {mockReports.length} report{mockReports.length !== 1 ? 's' : ''}{' '}
              generated
            </Text>

            <Grid
              templateColumns="repeat(auto-fill, minmax(360px, 1fr))"
              gap={4}
            >
              {mockReports.map(report => (
                <Box
                  key={report.id}
                  bg="bg.surface"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border.muted"
                  p={5}
                >
                  <Flex justify="space-between" align="start" mb={4}>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="600" color="text.primary">
                        {report.title}
                      </Text>
                      <HStack gap={2} color="text.tertiary" fontSize="xs">
                        <LuCalendar size={12} />
                        <Text>
                          {formatDateRange(report.dateFrom, report.dateTo)}
                        </Text>
                      </HStack>
                    </VStack>
                    <Badge
                      bg="bg.elevated"
                      color="text.secondary"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontFamily="mono"
                    >
                      {report.reportId}
                    </Badge>
                  </Flex>

                  {/* Stats */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={3} mb={4}>
                    <Box>
                      <Text fontSize="xs" color="text.tertiary">
                        Total
                      </Text>
                      <Text fontSize="sm" fontWeight="600" color="text.primary">
                        ${report.totalIncome.toLocaleString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="text.tertiary">
                        Verified
                      </Text>
                      <Text fontSize="sm" fontWeight="600" color="success.500">
                        ${report.totalVerified.toLocaleString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="text.tertiary">
                        Transactions
                      </Text>
                      <Text fontSize="sm" fontWeight="600" color="text.primary">
                        {report.transactionCount}
                      </Text>
                    </Box>
                  </Grid>

                  {/* Actions */}
                  <Flex
                    gap={2}
                    pt={4}
                    borderTop="1px solid"
                    borderColor="border.muted"
                  >
                    <Button
                      size="sm"
                      flex={1}
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      _hover={{ bg: 'bg.hover' }}
                    >
                      <HStack gap={2}>
                        <LuDownload size={14} />
                        <Text>Download</Text>
                      </HStack>
                    </Button>
                    <Button
                      size="sm"
                      flex={1}
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      _hover={{ bg: 'bg.hover' }}
                    >
                      <HStack gap={2}>
                        <LuExternalLink size={14} />
                        <Text>Share</Text>
                      </HStack>
                    </Button>
                  </Flex>
                </Box>
              ))}
            </Grid>
          </VStack>
        )}
      </Box>
    </Box>
  );
}
