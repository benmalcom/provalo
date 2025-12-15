'use client';

import { Box, Text, Spinner, HStack } from '@chakra-ui/react';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface WalletOption {
  value: string | undefined;
  label: string;
  subLabel?: string;
}

interface TransactionFiltersProps {
  walletOptions: WalletOption[];
  selectedWalletOption: WalletOption;
  onWalletChange: (walletId: string | undefined) => void;
  isLoadingWallets?: boolean;
}

export function TransactionFilters({
  walletOptions,
  selectedWalletOption,
  onWalletChange,
  isLoadingWallets = false,
}: TransactionFiltersProps) {
  // Show loading placeholder when wallets are loading
  const displayOptions = isLoadingWallets
    ? [{ value: undefined, label: 'Loading...', subLabel: undefined }]
    : walletOptions;

  const displayValue = isLoadingWallets
    ? { value: undefined, label: 'Loading wallets...', subLabel: undefined }
    : selectedWalletOption;

  return (
    <Box
      minW={{ base: '100%', sm: '180px' }}
      maxW={{ base: '100%', sm: '220px' }}
    >
      <CustomSelect<WalletOption>
        value={displayValue}
        onChange={option => onWalletChange(option?.value)}
        options={displayOptions}
        placeholder="Select wallet..."
        isSearchable={false}
        isDisabled={isLoadingWallets}
        getOptionLabel={option => option.label}
        formatOptionLabel={(option, { context }) =>
          context === 'menu' ? (
            <Box>
              <Text fontSize="sm">{option.label}</Text>
              {option.subLabel && (
                <Text fontSize="xs" color="text.tertiary">
                  {option.subLabel}
                </Text>
              )}
            </Box>
          ) : (
            <HStack gap={2}>
              {isLoadingWallets && <Spinner size="xs" color="primary.500" />}
              <Text
                fontSize="sm"
                color={isLoadingWallets ? 'text.tertiary' : 'text.primary'}
              >
                {option.label}
              </Text>
            </HStack>
          )
        }
      />
    </Box>
  );
}
