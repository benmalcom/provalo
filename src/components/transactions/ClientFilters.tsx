'use client';

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Input,
} from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';
import { DateRangePicker } from '@/components/ui/DatePicker';

export interface FilterState {
  hideZeroAmounts: boolean;
  showVerifiedOnly: boolean;
  showLabeledOnly: boolean;
  showUnlabeledOnly: boolean;
  minAmount: string;
  maxAmount: string;
}

interface ClientFiltersProps {
  // Date range
  selectedDates: Date[];
  onDateChange: (dates: Date[]) => void;

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;

  // Quick filters & amount
  filters: FilterState;
  appliedFilters: FilterState;
  onFilterChange: (key: keyof FilterState, value: boolean | string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ClientFilters({
  selectedDates,
  onDateChange,
  searchQuery,
  onSearchChange,
  filters,
  appliedFilters,
  onFilterChange,
  onApply,
  onReset,
}: ClientFiltersProps) {
  const filtersChanged =
    filters.hideZeroAmounts !== appliedFilters.hideZeroAmounts ||
    filters.showVerifiedOnly !== appliedFilters.showVerifiedOnly ||
    filters.showLabeledOnly !== appliedFilters.showLabeledOnly ||
    filters.showUnlabeledOnly !== appliedFilters.showUnlabeledOnly ||
    filters.minAmount !== appliedFilters.minAmount ||
    filters.maxAmount !== appliedFilters.maxAmount;

  return (
    <Box
      bg="bg.surface"
      borderRadius="xl"
      border="1px solid"
      borderColor="border.muted"
      p={5}
      mb={4}
    >
      <VStack gap={5} align="stretch">
        {/* Row 1: Date Range & Search */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          align={{ base: 'stretch', md: 'flex-end' }}
        >
          {/* Date Range Picker */}
          <Box
            minW={{ base: 'auto', md: '220px' }}
            maxW={{ base: '100%', md: '280px' }}
          >
            <Text
              fontSize="xs"
              fontWeight="600"
              color="text.tertiary"
              mb={2}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Date Range
            </Text>
            <DateRangePicker
              selectedDates={selectedDates}
              onDateChange={onDateChange}
              placeholder="All time"
              maxDate={new Date()}
            />
          </Box>

          {/* Search */}
          <Box flex={1}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="text.tertiary"
              mb={2}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Search
            </Text>
            <Input
              placeholder="Search by address, label, token..."
              bg="bg.panel"
              border="1px solid"
              borderColor="border.default"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              _hover={{ borderColor: 'border.hover' }}
              _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
            />
          </Box>
        </Flex>

        {/* Row 2: Quick Filters, Amount Range, Apply/Reset */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={6}
          align={{ base: 'stretch', lg: 'flex-start' }}
        >
          {/* Quick Filters - Pill Buttons */}
          <Box flex={1}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="text.tertiary"
              mb={3}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Quick Filters
            </Text>
            <Flex gap={2} flexWrap="wrap">
              <FilterPill
                label="Hide $0"
                active={filters.hideZeroAmounts}
                onClick={() =>
                  onFilterChange('hideZeroAmounts', !filters.hideZeroAmounts)
                }
                colorScheme="primary"
              />
              <FilterPill
                label="Verified"
                active={filters.showVerifiedOnly}
                onClick={() =>
                  onFilterChange('showVerifiedOnly', !filters.showVerifiedOnly)
                }
                colorScheme="green"
              />
              <FilterPill
                label="Labeled"
                active={filters.showLabeledOnly}
                onClick={() =>
                  onFilterChange('showLabeledOnly', !filters.showLabeledOnly)
                }
                colorScheme="primary"
              />
              <FilterPill
                label="Unlabeled"
                active={filters.showUnlabeledOnly}
                onClick={() =>
                  onFilterChange(
                    'showUnlabeledOnly',
                    !filters.showUnlabeledOnly
                  )
                }
                colorScheme="orange"
              />
            </Flex>
          </Box>

          {/* Amount Range */}
          <Box minW={{ base: 'auto', lg: '240px' }}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="text.tertiary"
              mb={3}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Amount Range (USD)
            </Text>
            <HStack gap={2}>
              <HStack
                bg="#1a1a1a"
                borderRadius="lg"
                border="1px solid"
                borderColor="whiteAlpha.200"
                px={3}
                py={2}
                flex={1}
              >
                <Text color="gray.500" fontSize="sm">
                  $
                </Text>
                <Input
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={e => onFilterChange('minAmount', e.target.value)}
                  border="none"
                  bg="transparent"
                  px={0}
                  py={0}
                  h="auto"
                  type="number"
                  size="sm"
                  color="white"
                  _focus={{ boxShadow: 'none' }}
                  _placeholder={{ color: 'gray.600' }}
                />
              </HStack>
              <Text color="gray.500" fontSize="sm">
                –
              </Text>
              <HStack
                bg="#1a1a1a"
                borderRadius="lg"
                border="1px solid"
                borderColor="whiteAlpha.200"
                px={3}
                py={2}
                flex={1}
              >
                <Text color="gray.500" fontSize="sm">
                  $
                </Text>
                <Input
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={e => onFilterChange('maxAmount', e.target.value)}
                  border="none"
                  bg="transparent"
                  px={0}
                  py={0}
                  h="auto"
                  type="number"
                  size="sm"
                  color="white"
                  _focus={{ boxShadow: 'none' }}
                  _placeholder={{ color: 'gray.600' }}
                />
              </HStack>
            </HStack>
          </Box>

          {/* Apply/Reset Buttons */}
          <VStack
            align={{ base: 'stretch', lg: 'flex-end' }}
            gap={2}
            justify="flex-end"
            minW={{ base: 'auto', lg: '160px' }}
          >
            <HStack gap={2} w={{ base: '100%', lg: 'auto' }}>
              <Button
                size="sm"
                variant="ghost"
                color="text.secondary"
                onClick={onReset}
                flex={{ base: 1, lg: 'none' }}
              >
                Reset
              </Button>
              <Button
                size="sm"
                bg={filtersChanged ? 'primary.500' : 'whiteAlpha.100'}
                color={filtersChanged ? 'white' : 'text.tertiary'}
                _hover={{
                  bg: filtersChanged ? 'primary.600' : 'whiteAlpha.100',
                }}
                onClick={onApply}
                disabled={!filtersChanged}
                flex={{ base: 1, lg: 'none' }}
              >
                {filtersChanged ? 'Apply' : 'Applied'}
              </Button>
            </HStack>
            {filtersChanged && (
              <Text
                fontSize="xs"
                color="yellow.500"
                textAlign={{ base: 'center', lg: 'right' }}
              >
                Click Apply to update
              </Text>
            )}
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
}

// Filter Pill Component
interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  colorScheme: 'primary' | 'green' | 'orange';
}

function FilterPill({ label, active, onClick, colorScheme }: FilterPillProps) {
  const colors = {
    primary: {
      border: active ? 'primary.500' : 'border.default',
      bg: active ? 'primary.500/15' : 'transparent',
      color: active ? 'primary.400' : 'text.secondary',
      hoverBorder: 'primary.400',
      hoverBg: active ? 'primary.500/20' : 'bg.hover',
    },
    green: {
      border: active ? 'green.500' : 'border.default',
      bg: active ? 'green.500/15' : 'transparent',
      color: active ? 'green.400' : 'text.secondary',
      hoverBorder: 'green.400',
      hoverBg: active ? 'green.500/20' : 'bg.hover',
    },
    orange: {
      border: active ? 'orange.500' : 'border.default',
      bg: active ? 'orange.500/15' : 'transparent',
      color: active ? 'orange.400' : 'text.secondary',
      hoverBorder: 'orange.400',
      hoverBg: active ? 'orange.500/20' : 'bg.hover',
    },
  };

  const c = colors[colorScheme];

  return (
    <Box
      as="button"
      px={3}
      py={1.5}
      borderRadius="full"
      border="1px solid"
      borderColor={c.border}
      bg={c.bg}
      color={c.color}
      fontSize="sm"
      fontWeight="500"
      cursor="pointer"
      transition="all 0.15s ease"
      _hover={{ borderColor: c.hoverBorder, bg: c.hoverBg }}
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={1.5}
    >
      {active && <LuCheck size={14} />}
      {label}
    </Box>
  );
}
