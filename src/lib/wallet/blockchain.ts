/**
 * Blockchain Interaction Functions
 * Low-level functions for reading/writing to the blockchain
 */

import {
  type Address,
  type PublicClient,
  type WalletClient,
  erc20Abi,
} from 'viem';
import { isNativeToken } from './registry';

/**
 * Read ERC20 token balance
 */
export async function readTokenBalance(
  publicClient: PublicClient,
  tokenAddress: Address,
  ownerAddress: Address
): Promise<bigint> {
  // Handle native ETH
  if (isNativeToken(tokenAddress)) {
    return publicClient.getBalance({ address: ownerAddress });
  }

  // ERC20 token
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [ownerAddress],
  });

  return balance;
}

/**
 * Read ERC20 token allowance
 */
export async function readTokenAllowance(
  publicClient: PublicClient,
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address
): Promise<bigint> {
  // Native ETH doesn't have allowances
  if (isNativeToken(tokenAddress)) {
    return BigInt(0);
  }

  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
  });

  return allowance;
}

/**
 * Read token decimals
 */
export async function readTokenDecimals(
  publicClient: PublicClient,
  tokenAddress: Address
): Promise<number> {
  if (isNativeToken(tokenAddress)) {
    return 18;
  }

  const decimals = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  return decimals;
}

/**
 * Read token symbol
 */
export async function readTokenSymbol(
  publicClient: PublicClient,
  tokenAddress: Address
): Promise<string> {
  if (isNativeToken(tokenAddress)) {
    return 'ETH';
  }

  const symbol = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  return symbol;
}

/**
 * Read token name
 */
export async function readTokenName(
  publicClient: PublicClient,
  tokenAddress: Address
): Promise<string> {
  if (isNativeToken(tokenAddress)) {
    return 'Ethereum';
  }

  const name = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'name',
  });

  return name;
}

/**
 * Approve token spending
 */
export async function approveToken(
  walletClient: WalletClient,
  publicClient: PublicClient,
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint
): Promise<`0x${string}`> {
  if (isNativeToken(tokenAddress)) {
    throw new Error('Cannot approve native ETH');
  }

  const account = walletClient.account;
  if (!account) {
    throw new Error('No account connected');
  }

  // Simulate the transaction first
  const { request } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
    account,
  });

  // Execute the transaction
  const hash = await walletClient.writeContract(request);

  return hash;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  publicClient: PublicClient,
  hash: `0x${string}`,
  confirmations = 1
): Promise<void> {
  await publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
  });
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(
  publicClient: PublicClient,
  hash: `0x${string}`
) {
  return publicClient.getTransactionReceipt({ hash });
}

/**
 * Read multiple token balances in parallel
 */
export async function readMultipleTokenBalances(
  publicClient: PublicClient,
  tokenAddresses: Address[],
  ownerAddress: Address
): Promise<Map<Address, bigint>> {
  const balances = new Map<Address, bigint>();

  const results = await Promise.allSettled(
    tokenAddresses.map(address =>
      readTokenBalance(publicClient, address, ownerAddress)
    )
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      balances.set(tokenAddresses[index], result.value);
    } else {
      console.error(
        `Failed to read balance for ${tokenAddresses[index]}:`,
        result.reason
      );
      balances.set(tokenAddresses[index], 0n);
    }
  });

  return balances;
}

/**
 * Estimate gas for approval
 */
export async function estimateApprovalGas(
  publicClient: PublicClient,
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
  amount: bigint
): Promise<bigint> {
  if (isNativeToken(tokenAddress)) {
    return 0n;
  }

  const gas = await publicClient.estimateContractGas({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
    account: ownerAddress,
  });

  return gas;
}

/**
 * Check if an address is a contract
 */
export async function isContract(
  publicClient: PublicClient,
  address: Address
): Promise<boolean> {
  const code = await publicClient.getBytecode({ address });
  return code !== undefined && code !== '0x';
}
