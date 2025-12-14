/**
 * Single Wallet API Routes
 *
 * GET /api/wallets/[id] - Get single wallet details
 * PATCH /api/wallets/[id] - Update wallet (label)
 * DELETE /api/wallets/[id] - Remove wallet from account
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/wallets/[id]
 * Get single wallet details
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
        address: true,
        chainId: true,
        label: true,
        verifiedAt: true,
        createdAt: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ wallet });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/wallets/[id]
 * Update wallet label
 *
 * Body:
 * - label?: string
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label } = body;

    // Check wallet belongs to user
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingWallet) {
      return NextResponse.json(
        { error: 'Wallet not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update wallet
    const wallet = await prisma.wallet.update({
      where: { id },
      data: { label: label || null },
      select: {
        id: true,
        address: true,
        chainId: true,
        label: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ wallet });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet', code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wallets/[id]
 * Remove wallet from account
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Check wallet belongs to user
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingWallet) {
      return NextResponse.json(
        { error: 'Wallet not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete wallet (cascades to transactions)
    await prisma.wallet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to delete wallet', code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}
