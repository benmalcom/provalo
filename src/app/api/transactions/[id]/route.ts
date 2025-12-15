/**
 * Single Transaction API
 *
 * PATCH /api/transactions/[id] - Update transaction label
 *
 * Note: [id] here is a composite of txHash-chainId-walletId
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { setTransactionLabel } from '@/lib/services/transactions';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { userLabel, txHash, chainId, walletId } = body;

    if (!txHash || !chainId || !walletId) {
      return NextResponse.json(
        { error: 'txHash, chainId, and walletId are required' },
        { status: 400 }
      );
    }

    if (typeof userLabel !== 'string') {
      return NextResponse.json(
        { error: 'userLabel must be a string' },
        { status: 400 }
      );
    }

    await setTransactionLabel(
      session.user.id,
      txHash,
      chainId,
      walletId,
      userLabel
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] PATCH /api/transactions/[id] error:', error);

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
