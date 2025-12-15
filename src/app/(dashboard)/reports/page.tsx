'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import {
  LuFileText,
  LuDownload,
  LuEye,
  LuShare2,
  LuInbox,
  LuArrowRight,
} from 'react-icons/lu';
import { Header } from '@/components/layout';
import { useReports, formatUsdAmount, type Report } from '@/lib/hooks';
import { logger } from '@/utils/logging';

// Template display names
const TEMPLATE_LABELS: Record<string, string> = {
  STANDARD: 'Standard',
  VISA_APPLICATION: 'Visa',
  RENTAL_APPLICATION: 'Rental',
  LOAN_APPLICATION: 'Loan',
};

export default function ReportsPage() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { reports, isLoading } = useReports();

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (from: Date | string, to: Date | string) => {
    return `${formatDate(from)} - ${formatDate(to)}`;
  };

  const handleDownload = async (report: Report) => {
    setDownloadingId(report.id);

    try {
      const response = await fetch(`/api/reports/${report.id}/pdf?format=pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toaster.create({
        title: 'Download complete',
        description: 'Your PDF has been downloaded',
        type: 'success',
      });
    } catch (error) {
      logger.error('Error downloading PDF', { error });
      toaster.create({
        title: 'Download failed',
        description: 'Could not generate PDF. Try preview instead.',
        type: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShare = async (report: Report) => {
    const shareUrl = `${window.location.origin}/verify/${report.reportId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Income Report ${report.reportId}`,
          text: 'Verify my income report',
          url: shareUrl,
        });
      } catch (error) {
        logger.error('Error sharing PDF', { error });

        // User cancelled or share failed, copy to clipboard instead
        await navigator.clipboard.writeText(shareUrl);
        toaster.create({
          title: 'Link copied',
          description: 'Verification link copied to clipboard',
          type: 'success',
        });
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toaster.create({
        title: 'Link copied',
        description: 'Verification link copied to clipboard',
        type: 'success',
      });
    }
  };

  return (
    <Box minH="100vh" overflowX="hidden">
      <Header title="Reports" />

      <Box p={{ base: 4, md: 6 }}>
        {/* Header with CTA */}
        <Flex
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          mb={6}
        >
          <VStack align="start" gap={1}>
            <Text fontSize="lg" fontWeight="600" color="text.primary">
              Report History
            </Text>
            <Text fontSize="sm" color="text.secondary">
              View and download your generated income reports
            </Text>
          </VStack>
          <Button
            bg="primary.500"
            color="white"
            _hover={{ bg: 'primary.600' }}
            onClick={() => router.push('/transactions')}
          >
            <HStack gap={2}>
              <LuFileText size={16} />
              <Text>New Report</Text>
              <LuArrowRight size={16} />
            </HStack>
          </Button>
        </Flex>

        {/* Reports List */}
        {isLoading ? (
          <Flex justify="center" py={12}>
            <Spinner size="lg" color="primary.500" />
          </Flex>
        ) : reports.length === 0 ? (
          <Box
            bg="bg.surface"
            borderRadius="xl"
            border="1px solid"
            borderColor="border.muted"
            p={{ base: 8, md: 12 }}
            textAlign="center"
          >
            <Box
              w={16}
              h={16}
              borderRadius="full"
              bg="bg.hover"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <LuInbox size={32} color="var(--chakra-colors-text-tertiary)" />
            </Box>
            <Text fontSize="lg" fontWeight="500" color="text.primary" mb={2}>
              No reports yet
            </Text>
            <Text
              fontSize="sm"
              color="text.secondary"
              mb={6}
              maxW="sm"
              mx="auto"
            >
              Generate your first income report from the Transactions page.
              Filter, label, and create professional reports.
            </Text>
            <Button
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              onClick={() => router.push('/transactions')}
            >
              <HStack gap={2}>
                <Text>Go to Transactions</Text>
                <LuArrowRight size={16} />
              </HStack>
            </Button>
          </Box>
        ) : (
          <VStack gap={4} align="stretch">
            {reports.map(report => (
              <Box
                key={report.id}
                bg="bg.surface"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.muted"
                p={{ base: 4, md: 5 }}
                transition="all 0.15s ease"
                _hover={{ borderColor: 'border.default' }}
              >
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                  gap={4}
                >
                  {/* Report Info */}
                  <VStack align="start" gap={2} flex={1}>
                    <HStack gap={3} flexWrap="wrap">
                      <Text fontWeight="600" color="text.primary">
                        {report.title || 'Income Report'}
                      </Text>
                      <Badge
                        bg="primary.500/15"
                        color="primary.400"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                      >
                        {TEMPLATE_LABELS[report.template] || report.template}
                      </Badge>
                    </HStack>

                    <HStack
                      gap={4}
                      flexWrap="wrap"
                      fontSize="sm"
                      color="text.secondary"
                    >
                      <Text>
                        {formatDateRange(report.dateFrom, report.dateTo)}
                      </Text>
                      <Text>•</Text>
                      <Text>{report.transactionCount} transactions</Text>
                      <Text>•</Text>
                      <Text fontWeight="500" color="green.400">
                        {formatUsdAmount(report.totalIncome)}
                      </Text>
                    </HStack>

                    <Text fontSize="xs" color="text.tertiary">
                      ID: {report.reportId} • Created{' '}
                      {formatDate(report.createdAt)}
                    </Text>
                  </VStack>

                  {/* Actions */}
                  <HStack gap={2} flexShrink={0}>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      _hover={{ bg: 'bg.hover' }}
                      onClick={() =>
                        window.open(`/api/reports/${report.id}/pdf`, '_blank')
                      }
                    >
                      <HStack gap={2}>
                        <LuEye size={14} />
                        <Text display={{ base: 'none', sm: 'inline' }}>
                          Preview
                        </Text>
                      </HStack>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      _hover={{ bg: 'bg.hover' }}
                      disabled={downloadingId === report.id}
                      onClick={() => handleDownload(report)}
                    >
                      <HStack gap={2}>
                        {downloadingId === report.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <LuDownload size={14} />
                        )}
                        <Text display={{ base: 'none', sm: 'inline' }}>
                          {downloadingId === report.id
                            ? 'Generating...'
                            : 'Download'}
                        </Text>
                      </HStack>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      _hover={{ bg: 'bg.hover' }}
                      onClick={() => handleShare(report)}
                    >
                      <HStack gap={2}>
                        <LuShare2 size={14} />
                        <Text display={{ base: 'none', sm: 'inline' }}>
                          Share
                        </Text>
                      </HStack>
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      <Toaster />
    </Box>
  );
}
