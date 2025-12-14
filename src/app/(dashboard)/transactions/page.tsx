'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Badge,
  Table,
  Link,
} from '@chakra-ui/react';
import { LuSearch, LuFilter, LuExternalLink, LuCircle } from 'react-icons/lu';
import { Header } from '@/components/layout';
import { FaCheckCircle } from 'react-icons/fa';

// Mock data for now
const mockTransactions = [
  {
    id: '1',
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    fromAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: '2500.00',
    tokenSymbol: 'USDC',
    amountUsd: 2500.0,
    timestamp: new Date('2024-12-01'),
    userLabel: 'Monthly retainer - Acme Corp',
    verifiedSender: { companyName: 'Acme Corp' },
  },
  {
    id: '2',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    fromAddress: '0x9876543210fedcba9876543210fedcba98765432',
    amount: '0.5',
    tokenSymbol: 'ETH',
    amountUsd: 1250.0,
    timestamp: new Date('2024-11-28'),
    userLabel: 'Design work',
    verifiedSender: null,
  },
  {
    id: '3',
    txHash: '0xfedcba9876543210fedcba9876543210fedcba98',
    fromAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: '1500.00',
    tokenSymbol: 'USDC',
    amountUsd: 1500.0,
    timestamp: new Date('2024-11-15'),
    userLabel: '',
    verifiedSender: { companyName: 'Acme Corp' },
  },
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handleLabelSave = (id: string) => {
    // TODO: Save label via API
    console.log('Saving label for', id, editLabel);
    setEditingId(null);
    setEditLabel('');
  };

  return (
    <Box>
      <Header title="Transactions" />

      <Box p={6}>
        {/* Filters */}
        <Flex gap={4} mb={6}>
          <Box position="relative" flex={1} maxW="400px">
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="text.tertiary"
            >
              <LuSearch size={18} />
            </Box>
            <Input
              pl={10}
              placeholder="Search by address, label, or amount..."
              bg="bg.surface"
              border="1px solid"
              borderColor="border.default"
              _hover={{ borderColor: 'border.default' }}
              _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Box>
          <Button
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            _hover={{ bg: 'bg.hover' }}
          >
            <HStack gap={2}>
              <LuFilter size={16} />
              <Text>Filter</Text>
            </HStack>
          </Button>
        </Flex>

        {/* Summary stats */}
        <Flex gap={4} mb={6}>
          <Box bg="bg.surface" borderRadius="lg" p={4} flex={1}>
            <Text fontSize="sm" color="text.tertiary" mb={1}>
              Total Income
            </Text>
            <Text fontSize="2xl" fontWeight="600" color="text.primary">
              $5,250.00
            </Text>
          </Box>
          <Box bg="bg.surface" borderRadius="lg" p={4} flex={1}>
            <Text fontSize="sm" color="text.tertiary" mb={1}>
              Verified
            </Text>
            <Text fontSize="2xl" fontWeight="600" color="success.500">
              $4,000.00
            </Text>
          </Box>
          <Box bg="bg.surface" borderRadius="lg" p={4} flex={1}>
            <Text fontSize="sm" color="text.tertiary" mb={1}>
              Transactions
            </Text>
            <Text fontSize="2xl" fontWeight="600" color="text.primary">
              3
            </Text>
          </Box>
        </Flex>

        {/* Transactions table */}
        <Box
          bg="bg.surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.muted"
          overflow="hidden"
        >
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.elevated">
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                  px={4}
                >
                  Date
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                >
                  From
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                >
                  Amount
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                >
                  Label
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                >
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="text.tertiary"
                  fontWeight="500"
                  py={3}
                  px={4}
                ></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {mockTransactions.map(tx => (
                <Table.Row
                  key={tx.id}
                  _hover={{ bg: 'bg.hover' }}
                  borderBottom="1px solid"
                  borderColor="border.muted"
                >
                  <Table.Cell py={4} px={4}>
                    <Text fontSize="sm" color="text.primary">
                      {formatDate(tx.timestamp)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <VStack align="start" gap={0}>
                      {tx.verifiedSender ? (
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color="text.primary"
                        >
                          {tx.verifiedSender.companyName}
                        </Text>
                      ) : null}
                      <Text
                        fontSize="xs"
                        color="text.tertiary"
                        fontFamily="mono"
                      >
                        {formatAddress(tx.fromAddress)}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell py={4}>
                    <VStack align="start" gap={0}>
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
                        ${tx.amountUsd.toLocaleString()}
                      </Text>
                      <Text fontSize="xs" color="text.tertiary">
                        {tx.amount} {tx.tokenSymbol}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell py={4}>
                    {editingId === tx.id ? (
                      <HStack gap={2}>
                        <Input
                          size="sm"
                          value={editLabel}
                          onChange={e => setEditLabel(e.target.value)}
                          placeholder="Enter label..."
                          bg="bg.canvas"
                          borderColor="border.default"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleLabelSave(tx.id)}
                        >
                          Save
                        </Button>
                      </HStack>
                    ) : (
                      <Text
                        fontSize="sm"
                        color={tx.userLabel ? 'text.primary' : 'text.tertiary'}
                        cursor="pointer"
                        _hover={{ color: 'primary.500' }}
                        onClick={() => {
                          setEditingId(tx.id);
                          setEditLabel(tx.userLabel);
                        }}
                      >
                        {tx.userLabel || 'Click to add label...'}
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell py={4}>
                    {tx.verifiedSender ? (
                      <Badge
                        bg="success.500/10"
                        color="success.500"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        <HStack gap={1}>
                          <FaCheckCircle size={12} />
                          <Text>Verified</Text>
                        </HStack>
                      </Badge>
                    ) : (
                      <Badge
                        bg="warning.500/10"
                        color="warning.500"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        <HStack gap={1}>
                          <LuCircle size={12} />
                          <Text>Pending</Text>
                        </HStack>
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell py={4} px={4}>
                    <Link
                      href={`https://basescan.org/tx/${tx.txHash}`}
                      target="_blank"
                      color="text.tertiary"
                      _hover={{ color: 'primary.500' }}
                      _focus={{ outline: 'none', boxShadow: 'none' }}
                    >
                      <LuExternalLink size={16} />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
}
