/**
 * Reports API
 *
 * GET /api/reports - List user's reports
 * POST /api/reports - Generate a new report
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateReportId } from '@/lib/services/reports/utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[Reports API] Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      dateFrom,
      dateTo,
      template = 'STANDARD',
      transactionIds,
    } = body;

    if (!dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'Date range is required' },
        { status: 400 }
      );
    }

    // Generate unique report ID
    const reportId = generateReportId();

    // Get transactions for the date range
    // We'll calculate totals from the provided transaction IDs
    const report = await prisma.report.create({
      data: {
        reportId,
        title: title || `Income Report`,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        template,
        transactionIds: JSON.stringify(transactionIds || []),
        totalIncome: body.totalIncome || 0,
        totalVerified: body.totalVerified || 0,
        transactionCount: body.transactionCount || 0,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      report,
      message: 'Report created successfully',
    });
  } catch (error) {
    console.error('[Reports API] Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
