'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Spinner,
  Popover,
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import {
  LuRefreshCw,
  LuExternalLink,
  LuInbox,
  LuFileText,
  LuTag,
  LuFilter,
  LuChevronDown,
  LuChevronUp,
} from 'react-icons/lu';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import { Header } from '@/components/layout';
import {
  TransactionFilters,
  ClientFilters,
  GenerateReportModal,
  TEMPLATE_OPTIONS,
  type FilterState,
  type TemplateOption,
} from '@/components/transactions';
import {
  useTransactions,
  useLinkedWallets,
  useReports,
  formatTransactionAmount,
  formatUsdAmount,
  shortenAddress,
  type Transaction,
} from '@/lib/hooks';

// Label Editor Component
interface LabelEditorProps {
  transaction: Transaction;
  onSave: (tx: Transaction, label: string) => Promise<void>;
  isUpdating: boolean;
}

function LabelEditor({ transaction, onSave, isUpdating }: LabelEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState(transaction.userLabel || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setLabel(transaction.userLabel || '');
  }, [transaction.userLabel]);

  const handleSave = async () => {
    await onSave(transaction, label);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLabel(transaction.userLabel || '');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={e => setIsOpen(e.open)}
      positioning={{ placement: 'bottom-start' }}
    >
      <Popover.Trigger asChild>
        <HStack
          gap={2}
          cursor="pointer"
          px={2}
          py={1}
          borderRadius="md"
          width="180px"
          _hover={{ bg: 'whiteAlpha.50' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
          _focusVisible={{ outline: 'none', boxShadow: 'none' }}
          transition="all 0.15s ease"
        >
          {transaction.userLabel ? (
            <>
              <LuTag size={14} color="var(--chakra-colors-text-tertiary)" />
              <Text fontSize="sm" color="text.primary" truncate>
                {transaction.userLabel}
              </Text>
            </>
          ) : (
            <>
              <LuTag size={14} color="var(--chakra-colors-text-tertiary)" />
              <Text fontSize="sm" color="text.tertiary" fontStyle="italic">
                Add label...
              </Text>
            </>
          )}
        </HStack>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          bg="bg.elevated"
          borderColor="border.default"
          borderRadius="xl"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
          p={0}
          w="280px"
        >
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body p={3}>
            <VStack gap={3} align="stretch">
              <Text
                fontSize="xs"
                fontWeight="600"
                color="text.tertiary"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Transaction Label
              </Text>
              <Input
                ref={inputRef}
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Freelance work for Acme Inc"
                size="sm"
                bg="bg.surface"
                borderColor="border.default"
                _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              />
              <HStack gap={2} justify="flex-end">
                <Button
                  size="sm"
                  variant="ghost"
                  color="text.tertiary"
                  onClick={handleCancel}
                  _hover={{ bg: 'bg.hover' }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  bg="primary.500"
                  color="white"
                  onClick={handleSave}
                  disabled={isUpdating}
                  _hover={{ bg: 'primary.600' }}
                >
                  {isUpdating ? <Spinner size="xs" /> : 'Save'}
                </Button>
              </HStack>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}

// Chain explorer URLs
const EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  137: 'https://polygonscan.com',
  42161: 'https://arbiscan.io',
  10: 'https://optimistic.etherscan.io',
  8453: 'https://basescan.org',
  11155111: 'https://sepolia.etherscan.io',
  84532: 'https://sepolia.basescan.org',
  421614: 'https://sepolia.arbiscan.io',
  11155420: 'https://sepolia-optimism.etherscan.io',
};

// Chain names
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  42161: 'Arbitrum',
  10: 'Optimism',
  8453: 'Base',
  11155111: 'Sepolia',
  84532: 'Base Sepolia',
  421614: 'Arbitrum Sepolia',
  11155420: 'Optimism Sepolia',
};

function getExplorerUrl(chainId: number, txHash: string): string {
  const baseUrl = EXPLORER_URLS[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

// Wallet option type for select
interface WalletOption {
  value: string | undefined;
  label: string;
  subLabel?: string;
}

const DEFAULT_FILTERS: FilterState = {
  hideZeroAmounts: true,
  showVerifiedOnly: false,
  showLabeledOnly: false,
  showUnlabeledOnly: false,
  minAmount: '',
  maxAmount: '',
};

export default function TransactionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>(
    undefined
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  // Report generation modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(
    TEMPLATE_OPTIONS[0]
  );

  // Get linked wallets
  const { wallets, isLoading: walletsLoading } = useLinkedWallets();

  // Get transactions for selected wallet (or all if none selected)
  const {
    transactions,
    summary,
    total,
    isLoading,
    isUpdating,
    updateLabel,
    refreshTransactions,
  } = useTransactions({ walletId: selectedWalletId });

  // Reports hook for creating reports
  const { createReport, isCreating } = useReports();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter handlers
  const handleFilterChange = (
    key: keyof FilterState,
    value: boolean | string
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  // Count active filters
  const activeFilterCount = [
    appliedFilters.hideZeroAmounts,
    appliedFilters.showVerifiedOnly,
    appliedFilters.showLabeledOnly,
    appliedFilters.showUnlabeledOnly,
    appliedFilters.minAmount !== '',
    appliedFilters.maxAmount !== '',
  ].filter(Boolean).length;

  // Build wallet options for select
  const walletOptions: WalletOption[] = [
    {
      value: undefined,
      label: 'All Wallets',
      subLabel: `${wallets.length} wallets linked`,
    },
    ...wallets.map(wallet => ({
      value: wallet.id,
      label: wallet.label || shortenAddress(wallet.address),
      subLabel: `${shortenAddress(wallet.address)} · ${CHAIN_NAMES[wallet.chainId] || `Chain ${wallet.chainId}`}`,
    })),
  ];

  const selectedWalletOption =
    walletOptions.find(opt => opt.value === selectedWalletId) ||
    walletOptions[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTransactions();
    setIsRefreshing(false);
  };

  // Filter transactions by search query and date range (client-side)
  const [dateFrom, dateTo] =
    selectedDates.length === 2 ? selectedDates : [undefined, undefined];

  const filteredTransactions = transactions.filter(tx => {
    // Date range filter
    if (dateFrom && dateTo) {
      const txDate = new Date(tx.timestamp);
      if (txDate < dateFrom || txDate > dateTo) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        tx.fromAddress.toLowerCase().includes(query) ||
        tx.userLabel?.toLowerCase().includes(query) ||
        tx.tokenSymbol.toLowerCase().includes(query) ||
        tx.verifiedSender?.companyName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Hide zero amounts
    if (
      appliedFilters.hideZeroAmounts &&
      (tx.amountUsd === 0 || tx.amountUsd === null)
    ) {
      return false;
    }

    // Show verified only
    if (appliedFilters.showVerifiedOnly && !tx.verifiedSender) {
      return false;
    }

    // Show labeled only
    if (appliedFilters.showLabeledOnly && !tx.userLabel) {
      return false;
    }

    // Show unlabeled only
    if (appliedFilters.showUnlabeledOnly && tx.userLabel) {
      return false;
    }

    // Min amount filter
    if (appliedFilters.minAmount !== '') {
      const min = parseFloat(appliedFilters.minAmount);
      if (!isNaN(min) && (tx.amountUsd || 0) < min) {
        return false;
      }
    }

    // Max amount filter
    if (appliedFilters.maxAmount !== '') {
      const max = parseFloat(appliedFilters.maxAmount);
      if (!isNaN(max) && (tx.amountUsd || 0) > max) {
        return false;
      }
    }

    return true;
  });

  // Calculate filtered summary for report
  const filteredSummary = {
    totalIncome: filteredTransactions.reduce(
      (sum, tx) => sum + (tx.amountUsd || 0),
      0
    ),
    verifiedIncome: filteredTransactions
      .filter(tx => tx.verifiedSender)
      .reduce((sum, tx) => sum + (tx.amountUsd || 0), 0),
    verifiedCount: filteredTransactions.filter(tx => tx.verifiedSender).length,
  };

  const handleGenerateReport = async () => {
    if (filteredTransactions.length === 0) return;

    // Determine date range
    const txDates = filteredTransactions.map(tx => new Date(tx.timestamp));
    const reportDateFrom =
      dateFrom || new Date(Math.min(...txDates.map(d => d.getTime())));
    const reportDateTo =
      dateTo || new Date(Math.max(...txDates.map(d => d.getTime())));

    const report = await createReport({
      title: reportTitle || undefined,
      dateFrom: reportDateFrom,
      dateTo: reportDateTo,
      template: selectedTemplate.value,
      walletId: selectedWalletId,
      transactionIds: filteredTransactions.map(tx => tx.txHash),
      totalIncome: filteredSummary.totalIncome,
      totalVerified: filteredSummary.verifiedIncome,
      transactionCount: filteredTransactions.length,
    });

    if (report) {
      toaster.create({
        title: 'Report generated',
        description: `Report ${report.reportId} has been created`,
        type: 'success',
      });
      setShowReportModal(false);
      setReportTitle('');
      // Navigate to reports page
      router.push('/reports');
    } else {
      toaster.create({
        title: 'Failed to generate report',
        description: 'Please try again',
        type: 'error',
      });
    }
  };

  return (
    <Box minH="100vh" overflowX="hidden">
      <Header title="Transactions" />

      <Box p={{ base: 4, md: 6 }} overflowX="auto">
        {/* Top row: Wallet (server filter), Filter Toggle, Actions */}
        <Flex
          gap={{ base: 3, md: 4 }}
          mb={4}
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', lg: 'center' }}
        >
          <Flex gap={3} flex={1} flexWrap="wrap" align="center">
            {/* Wallet Selector (server-side filter - triggers blockchain fetch) */}
            <TransactionFilters
              walletOptions={walletOptions}
              selectedWalletOption={selectedWalletOption}
              onWalletChange={setSelectedWalletId}
              isLoadingWallets={walletsLoading}
            />

            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              borderColor={
                activeFilterCount > 0 ? 'primary.500' : 'border.default'
              }
              color={activeFilterCount > 0 ? 'primary.400' : 'text.secondary'}
              _hover={{ bg: 'bg.hover' }}
              onClick={() => setShowFilters(!showFilters)}
              size="md"
            >
              <HStack gap={2}>
                <LuFilter size={16} />
                <Text display={{ base: 'none', sm: 'inline' }}>Filters</Text>
                {activeFilterCount > 0 && (
                  <Badge
                    bg="primary.500"
                    color="white"
                    fontSize="xs"
                    borderRadius="full"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
                {showFilters ? (
                  <LuChevronUp size={14} />
                ) : (
                  <LuChevronDown size={14} />
                )}
              </HStack>
            </Button>
          </Flex>

          <HStack gap={3} flexShrink={0}>
            <Button
              variant="outline"
              borderColor="border.default"
              color="text.secondary"
              _hover={{ bg: 'bg.hover' }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              size={{ base: 'md', md: 'md' }}
            >
              <HStack gap={2}>
                {isRefreshing ? (
                  <Spinner size="sm" />
                ) : (
                  <LuRefreshCw size={16} />
                )}
                <Text display={{ base: 'none', sm: 'inline' }}>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Text>
              </HStack>
            </Button>

            <Button
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              disabled={filteredTransactions.length === 0}
              size={{ base: 'md', md: 'md' }}
              onClick={() => setShowReportModal(true)}
            >
              <HStack gap={2}>
                <LuFileText size={16} />
                <Text display={{ base: 'none', sm: 'inline' }}>
                  Generate Report
                </Text>
              </HStack>
            </Button>
          </HStack>
        </Flex>

        {/* Expandable Client-Side Filters Panel */}
        {showFilters && (
          <ClientFilters
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            appliedFilters={appliedFilters}
            onFilterChange={handleFilterChange}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        )}

        {/* Summary stats - Shows filtered results */}
        <Flex
          gap={{ base: 3, md: 4 }}
          mb={6}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box
            bg="bg.surface"
            borderRadius="xl"
            p={4}
            flex={1}
            border="1px solid"
            borderColor="border.muted"
          >
            <Text
              fontSize="xs"
              color="text.tertiary"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {activeFilterCount > 0 ? 'Filtered Income' : 'Total Income'}
            </Text>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="600"
              color="green.400"
            >
              {formatUsdAmount(filteredSummary.totalIncome)}
            </Text>
            {activeFilterCount > 0 && (
              <Text fontSize="xs" color="text.tertiary" mt={1}>
                of {formatUsdAmount(summary?.totalIncome || 0)} total
              </Text>
            )}
          </Box>
          <Box
            bg="bg.surface"
            borderRadius="xl"
            p={4}
            flex={1}
            border="1px solid"
            borderColor="border.muted"
          >
            <Text
              fontSize="xs"
              color="text.tertiary"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Verified Income
            </Text>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="600"
              color="primary.400"
            >
              {formatUsdAmount(filteredSummary.verifiedIncome)}
            </Text>
            {activeFilterCount > 0 && filteredSummary.verifiedCount > 0 && (
              <Text fontSize="xs" color="text.tertiary" mt={1}>
                {filteredSummary.verifiedCount} verified transactions
              </Text>
            )}
          </Box>
          <Box
            bg="bg.surface"
            borderRadius="xl"
            p={4}
            flex={1}
            border="1px solid"
            borderColor="border.muted"
          >
            <Text
              fontSize="xs"
              color="text.tertiary"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {activeFilterCount > 0 ? 'Showing' : 'Transactions'}
            </Text>
            <HStack align="baseline" gap={2}>
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="600"
                color="text.primary"
              >
                {filteredTransactions.length}
              </Text>
              {activeFilterCount > 0 && (
                <Text fontSize="sm" color="text.tertiary">
                  of {total}
                </Text>
              )}
            </HStack>
            {filteredSummary.verifiedCount > 0 && (
              <Badge
                bg="green.500/15"
                color="green.400"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
                mt={1}
              >
                {filteredSummary.verifiedCount} verified
              </Badge>
            )}
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
          {isLoading ? (
            <Flex justify="center" align="center" py={12}>
              <VStack gap={3}>
                <Spinner size="lg" color="primary.500" />
                <Text color="text.tertiary" fontSize="sm">
                  Loading transactions...
                </Text>
              </VStack>
            </Flex>
          ) : filteredTransactions.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={12}
              gap={4}
            >
              <Box color="text.tertiary">
                <LuInbox size={48} />
              </Box>
              <VStack gap={1}>
                <Text color="text.primary" fontWeight="500">
                  {searchQuery
                    ? 'No matching transactions'
                    : 'No transactions found'}
                </Text>
                <Text
                  color="text.tertiary"
                  fontSize="sm"
                  textAlign="center"
                  px={4}
                >
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Connect a wallet and make sure it has incoming transactions'}
                </Text>
              </VStack>
            </Flex>
          ) : (
            <>
              {/* Desktop Table View */}
              <Box display={{ base: 'none', lg: 'block' }}>
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row bg="bg.elevated">
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                        px={4}
                      >
                        Date
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                      >
                        From
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                      >
                        Amount
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                      >
                        Label
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                      >
                        Status
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="text.tertiary"
                        fontWeight="500"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={3}
                        px={4}
                        textAlign="right"
                      >
                        Explorer
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredTransactions.map(tx => (
                      <Table.Row
                        key={`${tx.txHash}-${tx.chainId}`}
                        bg="bg.surface"
                        _hover={{ bg: 'whiteAlpha.50' }}
                        borderBottom="1px solid"
                        borderColor="border.muted"
                        transition="background 0.15s ease"
                      >
                        <Table.Cell py={4} px={4}>
                          <VStack align="start" gap={0}>
                            <Text
                              fontSize="sm"
                              color="text.primary"
                              fontWeight="500"
                            >
                              {formatDate(tx.timestamp)}
                            </Text>
                            <Badge
                              fontSize="xs"
                              bg="bg.elevated"
                              color="text.tertiary"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                              fontWeight="400"
                            >
                              {tx.chainLabel}
                            </Badge>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell py={4}>
                          <VStack align="start" gap={1}>
                            {tx.verifiedSender ? (
                              <HStack gap={1}>
                                <Box color="green.500">
                                  <FaCheckCircle size={12} />
                                </Box>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="text.primary"
                                >
                                  {tx.verifiedSender.companyName}
                                </Text>
                              </HStack>
                            ) : null}
                            <Text
                              fontSize="xs"
                              color="primary.400"
                              fontFamily="mono"
                              bg="primary.500/5"
                              px={2}
                              py={0.5}
                              borderRadius="md"
                            >
                              {shortenAddress(tx.fromAddress)}
                            </Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell py={4}>
                          <VStack align="start" gap={0}>
                            <Text
                              fontSize="md"
                              fontWeight="600"
                              color="green.400"
                            >
                              +{formatUsdAmount(tx.amountUsd)}
                            </Text>
                            <Text fontSize="xs" color="text.tertiary">
                              {formatTransactionAmount(
                                tx.amount,
                                tx.tokenDecimals,
                                tx.tokenSymbol
                              )}
                            </Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell py={4}>
                          <LabelEditor
                            transaction={tx}
                            onSave={updateLabel}
                            isUpdating={isUpdating}
                          />
                        </Table.Cell>
                        <Table.Cell py={4}>
                          {tx.verifiedSender ? (
                            <Badge
                              bg="green.500/15"
                              color="green.400"
                              fontSize="xs"
                              px={3}
                              py={1.5}
                              borderRadius="full"
                              fontWeight="500"
                            >
                              <HStack gap={1.5}>
                                <FaCheckCircle size={10} />
                                <Text>Verified</Text>
                              </HStack>
                            </Badge>
                          ) : (
                            <Badge
                              bg="orange.500/15"
                              color="orange.400"
                              fontSize="xs"
                              px={3}
                              py={1.5}
                              borderRadius="full"
                              fontWeight="500"
                            >
                              <HStack gap={1.5}>
                                <FaCircle size={8} />
                                <Text>Pending</Text>
                              </HStack>
                            </Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell py={4} px={4} textAlign="right">
                          <Link
                            href={getExplorerUrl(tx.chainId, tx.txHash)}
                            target="_blank"
                            display="inline-flex"
                            alignItems="center"
                            gap={1}
                            color="primary.400"
                            fontSize="sm"
                            fontWeight="500"
                            _hover={{
                              color: 'primary.300',
                              textDecoration: 'none',
                            }}
                            _focus={{ outline: 'none', boxShadow: 'none' }}
                            transition="color 0.15s ease"
                          >
                            <Text display={{ base: 'none', xl: 'inline' }}>
                              View
                            </Text>
                            <LuExternalLink size={14} />
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Mobile Card View */}
              <VStack
                display={{ base: 'flex', lg: 'none' }}
                gap={3}
                p={4}
                w="100%"
              >
                {filteredTransactions.map(tx => (
                  <Box
                    key={`mobile-${tx.txHash}-${tx.chainId}`}
                    w="100%"
                    bg="bg.elevated"
                    borderRadius="xl"
                    p={4}
                    border="1px solid"
                    borderColor="border.muted"
                    overflow="hidden"
                  >
                    {/* Header: Date & Status */}
                    <Flex justify="space-between" align="center" mb={3}>
                      <HStack gap={2}>
                        <Text
                          fontSize="sm"
                          color="text.primary"
                          fontWeight="500"
                        >
                          {formatDate(tx.timestamp)}
                        </Text>
                        <Badge
                          fontSize="xs"
                          bg="bg.surface"
                          color="text.tertiary"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                        >
                          {tx.chainLabel}
                        </Badge>
                      </HStack>
                      {tx.verifiedSender ? (
                        <Badge
                          bg="green.500/15"
                          color="green.400"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          <HStack gap={1}>
                            <FaCheckCircle size={10} />
                            <Text>Verified</Text>
                          </HStack>
                        </Badge>
                      ) : (
                        <Badge
                          bg="orange.500/15"
                          color="orange.400"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          Pending
                        </Badge>
                      )}
                    </Flex>

                    {/* Amount */}
                    <Text
                      fontSize="xl"
                      fontWeight="700"
                      color="green.400"
                      mb={2}
                    >
                      +{formatUsdAmount(tx.amountUsd)}
                    </Text>
                    <Text fontSize="xs" color="text.tertiary" mb={3}>
                      {formatTransactionAmount(
                        tx.amount,
                        tx.tokenDecimals,
                        tx.tokenSymbol
                      )}
                    </Text>

                    {/* From */}
                    <VStack align="start" gap={1} mb={3}>
                      <Text
                        fontSize="xs"
                        color="text.tertiary"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        From
                      </Text>
                      {tx.verifiedSender && (
                        <HStack gap={1}>
                          <Box color="green.500">
                            <FaCheckCircle size={12} />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="500"
                            color="text.primary"
                          >
                            {tx.verifiedSender.companyName}
                          </Text>
                        </HStack>
                      )}
                      <Text
                        fontSize="xs"
                        color="primary.400"
                        fontFamily="mono"
                        bg="primary.500/5"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {shortenAddress(tx.fromAddress)}
                      </Text>
                    </VStack>

                    {/* Label */}
                    <Box mb={3}>
                      <Text
                        fontSize="xs"
                        color="text.tertiary"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        mb={1}
                      >
                        Label
                      </Text>
                      <LabelEditor
                        transaction={tx}
                        onSave={updateLabel}
                        isUpdating={isUpdating}
                      />
                    </Box>

                    {/* Explorer Link */}
                    <Link
                      href={getExplorerUrl(tx.chainId, tx.txHash)}
                      target="_blank"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      w="100%"
                      py={2}
                      bg="primary.500/10"
                      color="primary.400"
                      borderRadius="lg"
                      fontSize="sm"
                      fontWeight="500"
                      _hover={{ bg: 'primary.500/20', textDecoration: 'none' }}
                      transition="background 0.15s ease"
                    >
                      View on Explorer
                      <LuExternalLink size={14} />
                    </Link>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Box>
      </Box>

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onGenerate={handleGenerateReport}
        isGenerating={isCreating}
        transactionCount={filteredTransactions.length}
        verifiedCount={filteredSummary.verifiedCount}
        totalIncome={filteredSummary.totalIncome}
        dateRange={
          selectedDates.length === 2
            ? [selectedDates[0], selectedDates[1]]
            : undefined
        }
        reportTitle={reportTitle}
        onReportTitleChange={setReportTitle}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />

      <Toaster />
    </Box>
  );
}
