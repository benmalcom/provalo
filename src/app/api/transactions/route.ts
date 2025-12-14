/**
 * Transactions API
 *
 * GET /api/transactions - Fetch transactions from Alchemy with metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getAllUserTransactions,
  getWalletTransactions,
  getTransactionSummary,
} from '@/lib/services/transactions';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const walletId = searchParams.get('walletId');
    const skipCache = searchParams.get('refresh') === 'true';
    const maxCount = parseInt(searchParams.get('limit') || '50', 10);

    let transactions;

    if (walletId) {
      // Fetch for specific wallet
      const result = await getWalletTransactions(session.user.id, walletId, {
        maxCount,
        skipCache,
      });
      transactions = result.transactions;
    } else {
      // Fetch for all wallets
      transactions = await getAllUserTransactions(session.user.id, {
        maxCountPerWallet: maxCount,
        skipCache,
      });
    }

    // Calculate summary
    const summary = await getTransactionSummary(transactions);

    return NextResponse.json({
      transactions,
      summary,
      total: transactions.length,
    });
  } catch (error) {
    console.error('[API] GET /api/transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
