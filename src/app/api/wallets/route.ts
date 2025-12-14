/**
 * Wallets API Routes
 *
 * POST /api/wallets - Link a new wallet to user account
 * GET /api/wallets - Get user's linked wallets
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage, getAddress } from 'viem';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/wallets
 * Returns all wallets linked to the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        address: true,
        chainId: true,
        label: true,
        verifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ wallets });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallets
 * Link a new wallet to the user's account
 *
 * Body:
 * - address: string (0x...)
 * - chainId: number
 * - message: string (the message that was signed)
 * - signature: string (the signature)
 * - label?: string (optional user-friendly label)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { address, chainId, message, signature, label } = body;

    // Validate required fields
    if (!address || !chainId || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Validate address format
    let checksumAddress: string;
    try {
      checksumAddress = getAddress(address);
    } catch {
      return NextResponse.json(
        { error: 'Invalid address format', code: 'INVALID_ADDRESS' },
        { status: 400 }
      );
    }

    // Verify the signature
    let isValid: boolean;
    try {
      isValid = await verifyMessage({
        address: checksumAddress as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
    } catch (error) {
      console.error('Signature verification error:', error);
      return NextResponse.json(
        { error: 'Signature verification failed', code: 'VERIFICATION_FAILED' },
        { status: 400 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature', code: 'INVALID_SIGNATURE' },
        { status: 400 }
      );
    }

    // Check if wallet is already linked to this user
    const existingWallet = await prisma.wallet.findUnique({
      where: {
        address_chainId: {
          address: checksumAddress,
          chainId,
        },
      },
    });

    if (existingWallet) {
      if (existingWallet.userId === session.user.id) {
        return NextResponse.json(
          {
            error: 'Wallet already linked to your account',
            code: 'ALREADY_LINKED',
          },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          {
            error: 'Wallet is linked to another account',
            code: 'WALLET_TAKEN',
          },
          { status: 409 }
        );
      }
    }

    // Create wallet record
    const wallet = await prisma.wallet.create({
      data: {
        address: checksumAddress,
        chainId,
        label: label || null,
        message,
        signature,
        userId: session.user.id,
      },
      select: {
        id: true,
        address: true,
        chainId: true,
        label: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ wallet }, { status: 201 });
  } catch (error) {
    console.error('Error linking wallet:', error);
    return NextResponse.json(
      { error: 'Failed to link wallet', code: 'LINK_ERROR' },
      { status: 500 }
    );
  }
}
