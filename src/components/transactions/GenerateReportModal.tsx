'use client';

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { LuX, LuCheck, LuFileText } from 'react-icons/lu';
import { formatUsdAmount } from '@/lib/hooks';

export type TemplateValue =
  | 'STANDARD'
  | 'VISA_APPLICATION'
  | 'RENTAL_APPLICATION'
  | 'LOAN_APPLICATION';

export interface TemplateOption {
  value: TemplateValue;
  label: string;
  description: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    value: 'STANDARD',
    label: 'Standard Income Statement',
    description: 'General purpose income report',
  },
  {
    value: 'VISA_APPLICATION',
    label: 'Visa Application',
    description: 'Formatted for immigration applications',
  },
  {
    value: 'RENTAL_APPLICATION',
    label: 'Rental Application',
    description: 'Formatted for landlords',
  },
  {
    value: 'LOAN_APPLICATION',
    label: 'Loan Application',
    description: 'Formatted for financial institutions',
  },
];

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  transactionCount: number;
  verifiedCount: number;
  totalIncome: number;
  dateRange?: [Date, Date];
  reportTitle: string;
  onReportTitleChange: (title: string) => void;
  selectedTemplate: TemplateOption;
  onTemplateChange: (template: TemplateOption) => void;
}

export function GenerateReportModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  transactionCount,
  verifiedCount,
  totalIncome,
  dateRange,
  reportTitle,
  onReportTitleChange,
  selectedTemplate,
  onTemplateChange,
}: GenerateReportModalProps) {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.800"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      onClick={onClose}
    >
      <Box
        bg="#1a1a1a"
        borderRadius="xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
        maxW="500px"
        w="100%"
        maxH="90vh"
        overflow="auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <Flex
          justify="space-between"
          align="center"
          p={5}
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Text fontSize="lg" fontWeight="600" color="white">
            Generate Income Report
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            p={1}
            color="gray.400"
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            <LuX size={20} />
          </Button>
        </Flex>

        {/* Modal Body */}
        <VStack gap={5} p={5} align="stretch">
          {/* Summary */}
          <Box
            bg="whiteAlpha.50"
            borderRadius="lg"
            p={4}
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <Text fontSize="sm" fontWeight="600" color="gray.400" mb={3}>
              Report Summary
            </Text>
            <Flex gap={4} wrap="wrap">
              <Box flex={1} minW="100px">
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Transactions
                </Text>
                <Text fontSize="xl" fontWeight="600" color="white">
                  {transactionCount}
                </Text>
              </Box>
              <Box flex={1} minW="100px">
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Verified
                </Text>
                <Text fontSize="xl" fontWeight="600" color="primary.400">
                  {verifiedCount}
                </Text>
              </Box>
              <Box flex={1} minW="100px">
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Total Income
                </Text>
                <Text fontSize="xl" fontWeight="600" color="green.400">
                  {formatUsdAmount(totalIncome)}
                </Text>
              </Box>
            </Flex>
            {dateRange && (
              <Text fontSize="xs" color="gray.500" mt={3}>
                Period: {dateRange[0].toLocaleDateString()} -{' '}
                {dateRange[1].toLocaleDateString()}
              </Text>
            )}
          </Box>

          {/* Report Title */}
          <Box>
            <Text fontSize="sm" fontWeight="500" color="gray.400" mb={2}>
              Report Title (Optional)
            </Text>
            <Input
              placeholder="e.g., Q4 2024 Income Report"
              value={reportTitle}
              onChange={e => onReportTitleChange(e.target.value)}
              bg="#252525"
              border="1px solid"
              borderColor="whiteAlpha.200"
              color="white"
              _hover={{ borderColor: 'whiteAlpha.300' }}
              _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              _placeholder={{ color: 'gray.600' }}
            />
          </Box>

          {/* Template Selection */}
          <Box>
            <Text fontSize="sm" fontWeight="500" color="gray.400" mb={2}>
              Report Template
            </Text>
            <VStack gap={2} align="stretch">
              {TEMPLATE_OPTIONS.map(template => (
                <Box
                  key={template.value}
                  p={3}
                  borderRadius="lg"
                  border="2px solid"
                  borderColor={
                    selectedTemplate.value === template.value
                      ? 'primary.500'
                      : 'whiteAlpha.200'
                  }
                  bg={
                    selectedTemplate.value === template.value
                      ? 'primary.500/15'
                      : 'whiteAlpha.50'
                  }
                  cursor="pointer"
                  onClick={() => onTemplateChange(template)}
                  transition="all 0.15s ease"
                  _hover={{
                    borderColor:
                      selectedTemplate.value === template.value
                        ? 'primary.500'
                        : 'whiteAlpha.400',
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="sm" fontWeight="500" color="white">
                        {template.label}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {template.description}
                      </Text>
                    </Box>
                    {selectedTemplate.value === template.value && (
                      <Box color="primary.500">
                        <LuCheck size={20} />
                      </Box>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>

        {/* Modal Footer */}
        <Flex
          p={5}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          gap={3}
          justify="flex-end"
        >
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            bg="primary.500"
            color="white"
            _hover={{ bg: 'primary.600' }}
            onClick={onGenerate}
            disabled={isGenerating || transactionCount === 0}
          >
            {isGenerating ? (
              <HStack gap={2}>
                <Spinner size="sm" />
                <Text>Generating...</Text>
              </HStack>
            ) : (
              <HStack gap={2}>
                <LuFileText size={16} />
                <Text>Generate Report</Text>
              </HStack>
            )}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
