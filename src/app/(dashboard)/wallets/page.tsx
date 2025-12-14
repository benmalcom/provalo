'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Badge,
  Link,
  Input,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuWallet,
  LuExternalLink,
  LuTrash2,
  LuPencil,
  LuCheck,
  LuX,
} from 'react-icons/lu';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout';
import { useWallet } from '@/lib/wallet';
import { useLinkedWallets } from '@/lib/hooks';
import { logger } from '@/utils/logging';

export default function WalletsPage() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const { connector } = useAccount();
  const {
    wallets,
    isLoading,
    linkWallet,
    updateWallet,
    removeWallet,
    isLinking,
    isUpdating,
  } = useLinkedWallets();
  const [error, setError] = useState<string | null>(null);
  const [pendingLink, setPendingLink] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  // Track the address we're trying to link to detect wallet changes
  const previousAddressRef = useRef<string | null>(null);

  // Check if current wallet is already linked
  const isCurrentWalletLinked = address
    ? wallets.some(w => w.address.toLowerCase() === address.toLowerCase())
    : false;

  // Auto-link wallet after connection (only when address changes to a new wallet)
  useEffect(() => {
    if (isConnected && address && pendingLink) {
      // Check if this is a different wallet than before
      const isDifferentWallet = previousAddressRef.current !== address;
      previousAddressRef.current = address;

      // Only proceed if connected with a new/different wallet
      if (!isDifferentWallet && isCurrentWalletLinked) {
        setPendingLink(false);
        setError(
          'This wallet is already linked. Please connect a different wallet.'
        );
        disconnect();
        return;
      }

      const timer = setTimeout(async () => {
        // Double-check it's not already linked
        const alreadyLinked = wallets.some(
          w => w.address.toLowerCase() === address.toLowerCase()
        );

        if (alreadyLinked) {
          setPendingLink(false);
          setError(
            'This wallet is already linked. Please connect a different wallet.'
          );
          disconnect();
          return;
        }

        setPendingLink(false);
        try {
          await linkWallet(connector?.name || undefined);
          setError(null);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to link wallet';
          setError(message);
        } finally {
          // Always disconnect after linking attempt
          disconnect();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    isConnected,
    address,
    pendingLink,
    wallets,
    linkWallet,
    connector,
    isCurrentWalletLinked,
    disconnect,
  ]);

  const handleLinkNewWallet = async () => {
    setError(null);

    // Store current address before disconnecting
    previousAddressRef.current = address || null;

    // Disconnect first if already connected (to allow choosing different wallet)
    if (isConnected) {
      await disconnect();
      // Wait for disconnect to fully complete before opening modal
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setPendingLink(true);
    try {
      await connect();
    } catch (error) {
      logger.error('Error linking new wallet', { error });
      setPendingLink(false);
      setError('Failed to connect wallet');
    }
  };

  const handleLinkCurrentWallet = async () => {
    setError(null);

    if (!isConnected) {
      setPendingLink(true);
      try {
        await connect();
      } catch (error) {
        logger.error('Error linking current wallet', { error });
        setPendingLink(false);
        setError('Failed to connect wallet');
      }
      return;
    }

    if (isCurrentWalletLinked) {
      setError('This wallet is already linked to your account');
      return;
    }

    try {
      await linkWallet(connector?.name || undefined);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to link wallet';
      setError(message);
    }
  };

  const handleStartEdit = (wallet: { id: string; label: string | null }) => {
    setEditingWalletId(wallet.id);
    setEditLabel(wallet.label || '');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateWallet(id, editLabel || null);
      setEditingWalletId(null);
      setEditLabel('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update wallet';
      setError(message);
    }
  };

  const handleCancelEdit = () => {
    setEditingWalletId(null);
    setEditLabel('');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Box>
      <Header title="Wallets" />

      <Box p={6}>
        {/* Error message */}
        {error && (
          <Box
            bg="rgba(239, 68, 68, 0.1)"
            border="1px solid rgba(239, 68, 68, 0.3)"
            borderRadius="xl"
            p={3}
            mb={6}
          >
            <HStack justify="space-between">
              <Text color="#ef4444" fontSize="sm">
                {error}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color="#ef4444"
                onClick={() => setError(null)}
              >
                <LuX size={14} />
              </Button>
            </HStack>
          </Box>
        )}

        {/* Empty state or wallet list */}
        {isLoading ? (
          <Flex justify="center" py={12}>
            <Text color="text.tertiary">Loading wallets...</Text>
          </Flex>
        ) : wallets.length === 0 ? (
          /* Empty State */
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
              bg="rgba(6, 182, 212, 0.1)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <LuWallet size={32} color="#06B6D4" />
            </Box>

            <Text fontSize="lg" fontWeight="600" color="text.primary" mb={2}>
              No wallets linked
            </Text>
            <Text color="text.secondary" textAlign="center" maxW="sm" mb={6}>
              Connect and link your first wallet to start tracking your crypto
              income.
            </Text>

            <Button
              bg="#06B6D4"
              color="white"
              _hover={{ bg: '#0891b2' }}
              onClick={handleLinkCurrentWallet}
              disabled={isLinking || pendingLink}
            >
              <HStack gap={2}>
                <LuPlus size={18} />
                <Text>
                  {pendingLink
                    ? 'Connecting...'
                    : isLinking
                      ? 'Signing...'
                      : 'Connect Wallet'}
                </Text>
              </HStack>
            </Button>

            {isConnected && (
              <VStack gap={2} mt={3}>
                <Text fontSize="sm" color="text.tertiary">
                  Connected: {connector?.name} ({formatAddress(address!)})
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  color="text.tertiary"
                  _hover={{ color: '#ef4444' }}
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Button>
              </VStack>
            )}
          </Flex>
        ) : (
          /* Wallet List */
          <VStack gap={6} align="stretch">
            {/* Header with count and add button */}
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="text.secondary">
                {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} linked
              </Text>
              <Button
                size="sm"
                bg="#06B6D4"
                color="white"
                _hover={{ bg: '#0891b2' }}
                onClick={handleLinkNewWallet}
                disabled={isLinking || pendingLink}
              >
                <HStack gap={2}>
                  <LuPlus size={16} />
                  <Text>
                    {pendingLink
                      ? 'Connecting...'
                      : isLinking
                        ? 'Signing...'
                        : 'Link Another'}
                  </Text>
                </HStack>
              </Button>
            </Flex>

            {/* Wallet cards grid */}
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={4}
            >
              {wallets.map(wallet => (
                <Box
                  key={wallet.id}
                  bg="bg.surface"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border.muted"
                  p={5}
                  _hover={{ borderColor: 'rgba(6, 182, 212, 0.5)' }}
                  transition="border-color 0.2s"
                >
                  <Flex justify="space-between" align="start" mb={4}>
                    <VStack align="start" gap={1}>
                      <HStack gap={2}>
                        <Box
                          w={8}
                          h={8}
                          bg="rgba(6, 182, 212, 0.1)"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <LuWallet size={16} color="#06B6D4" />
                        </Box>

                        {editingWalletId === wallet.id ? (
                          <HStack gap={1}>
                            <Input
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              size="sm"
                              width="120px"
                              bg="bg.canvas"
                              border="1px solid"
                              borderColor="border.default"
                              _focus={{ borderColor: 'accent.default' }}
                              autoFocus
                            />
                            <Button
                              size="xs"
                              variant="ghost"
                              color="#10B981"
                              onClick={() => handleSaveEdit(wallet.id)}
                              disabled={isUpdating}
                            >
                              <LuCheck size={14} />
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="text.tertiary"
                              onClick={handleCancelEdit}
                            >
                              <LuX size={14} />
                            </Button>
                          </HStack>
                        ) : (
                          <HStack gap={1}>
                            <Text fontWeight="600" color="text.primary">
                              {wallet.label || 'Wallet'}
                            </Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="text.tertiary"
                              _hover={{ color: 'text.secondary' }}
                              onClick={() => handleStartEdit(wallet)}
                            >
                              <LuPencil size={12} />
                            </Button>
                          </HStack>
                        )}
                      </HStack>
                      <HStack gap={2} ml={10}>
                        <Text
                          fontSize="sm"
                          color="text.secondary"
                          fontFamily="mono"
                        >
                          {formatAddress(wallet.address)}
                        </Text>
                        <Link
                          href={`https://etherscan.io/address/${wallet.address}`}
                          target="_blank"
                          color="text.tertiary"
                          _hover={{ color: '#06B6D4' }}
                          _focus={{ outline: 'none', boxShadow: 'none' }}
                        >
                          <LuExternalLink size={14} />
                        </Link>
                      </HStack>
                    </VStack>
                    <Badge
                      bg="rgba(16, 185, 129, 0.1)"
                      color="#10B981"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      Verified
                    </Badge>
                  </Flex>

                  <Flex
                    justify="space-between"
                    align="center"
                    pt={3}
                    borderTop="1px solid"
                    borderColor="border.muted"
                  >
                    <Text fontSize="xs" color="text.tertiary">
                      Linked {new Date(wallet.verifiedAt).toLocaleDateString()}
                    </Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="text.tertiary"
                      _hover={{
                        color: '#ef4444',
                        bg: 'rgba(239, 68, 68, 0.1)',
                      }}
                      onClick={() => removeWallet(wallet.id)}
                    >
                      <LuTrash2 size={14} />
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
