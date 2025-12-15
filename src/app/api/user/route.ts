/**
 * User Profile API Routes
 *
 * GET /api/user - Get current user profile
 * PATCH /api/user - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/user
 * Get current user's profile
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        displayName: true,
        businessName: true,
        address: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            wallets: true,
            transactionMetas: true,
            reports: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user
 * Update user profile
 *
 * Body:
 * - displayName?: string - Name shown on statements
 * - businessName?: string - Business/company name
 * - address?: string - Physical address
 * - phone?: string - Contact phone
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, businessName, address, phone } = body;

    // Validate input lengths
    if (displayName && displayName.length > 100) {
      return NextResponse.json(
        {
          error: 'Display name too long (max 100 characters)',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      );
    }

    if (businessName && businessName.length > 150) {
      return NextResponse.json(
        {
          error: 'Business name too long (max 150 characters)',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      );
    }

    if (address && address.length > 500) {
      return NextResponse.json(
        {
          error: 'Address too long (max 500 characters)',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      );
    }

    if (phone && phone.length > 20) {
      return NextResponse.json(
        { error: 'Phone too long (max 20 characters)', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        displayName: displayName ?? undefined,
        businessName: businessName ?? undefined,
        address: address ?? undefined,
        phone: phone ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        displayName: true,
        businessName: true,
        address: true,
        phone: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}
