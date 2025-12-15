/**
 * Report PDF Generation API
 * GET /api/reports/[id]/pdf - Generate professional income statement
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Vercel serverless config for PDF generation
export const maxDuration = 30; // 30 seconds timeout
export const dynamic = 'force-dynamic';

interface ReportTransaction {
  txHash: string;
  fromAddress: string;
  amountUsd: number;
  timestamp: string;
  userLabel?: string;
  verifiedSender?: { companyName: string };
}

function generateReportHTML(
  report: {
    reportId: string;
    title: string | null;
    dateFrom: Date;
    dateTo: Date;
    totalIncome: number;
    totalVerified: number;
    transactionCount: number;
    createdAt: Date;
    template: string;
  },
  user: {
    name?: string | null;
    email: string;
    businessName?: string | null;
    address?: string | null;
    phone?: string | null;
  },
  transactions: ReportTransaction[]
): string {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

  const formatShortDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);

  const verifiedCount = transactions.filter(tx => tx.verifiedSender).length;

  const templateTitles: Record<string, string> = {
    STANDARD: 'Income Statement',
    VISA_APPLICATION: 'Income Statement for Visa Application',
    RENTAL_APPLICATION: 'Income Statement for Rental Application',
    LOAN_APPLICATION: 'Income Statement for Loan Application',
  };
  const templateTitle = templateTitles[report.template] || 'Income Statement';
  const userName = user.name || user.email.split('@')[0];
  const addressLines = user.address?.split('\n').filter(l => l.trim()) || [];

  // Logo SVG with dark text for white background
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="115" height="48">
    <g transform="translate(0, 8) scale(0.6)">
      <rect x="8" y="15" width="58" height="75" rx="8" fill="#0891B2" opacity="0.2"/>
      <rect x="16" y="5" width="58" height="75" rx="8" fill="#0891B2"/>
      <rect x="28" y="22" width="34" height="6" rx="3" fill="white" opacity="0.6"/>
      <rect x="28" y="38" width="22" height="6" rx="3" fill="white" opacity="0.6"/>
      <circle cx="66" cy="70" r="25" fill="#1e293b"/>
      <circle cx="66" cy="70" r="21" fill="#059669"/>
      <path d="M54 70 L62 78 L78 62" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
    <text x="58" y="45" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 38px; font-weight: 600; fill: #1e293b;">pro<tspan fill="#0891B2">v</tspan>alo</text>
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title || templateTitle} - ${report.reportId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #fff;
      color: #334155;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 56px;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    
    .logo { height: 48px; }
    
    .header-right { text-align: right; }
    
    .doc-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    
    .doc-id {
      font-size: 12px;
      color: #64748b;
    }
    
    /* Divider */
    .divider {
      height: 3px;
      background: linear-gradient(90deg, #0891B2, #059669);
      margin-bottom: 36px;
    }
    
    /* Info Row */
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 36px;
      gap: 24px;
    }
    
    .info-block {
      flex: 1;
      max-width: 48%;
    }
    
    .info-block h3 {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .info-block .name {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
      word-wrap: break-word;
    }
    
    .info-block .detail {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
      word-wrap: break-word;
    }
    
    /* Summary - Simple inline */
    .summary {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      gap: 32px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .summary-item {
      display: flex;
      flex-direction: column;
    }
    
    .summary-item .label {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-item .value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .summary-item.total {
      margin-left: auto;
    }
    
    .summary-item.total .value {
      font-size: 20px;
      color: #059669;
    }
    
    /* Table */
    .table-section {
      margin: 32px 0;
    }
    
    .table-section h3 {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: #0891B2;
    }
    
    th {
      color: white;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
    }
    
    th:last-child { text-align: right; }
    
    td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      vertical-align: top;
    }
    
    tbody tr:hover { background: #fafafa; }
    
    .cell-date {
      color: #64748b;
      white-space: nowrap;
      width: 100px;
    }
    
    .cell-source {
      color: #1e293b;
    }
    
    .source-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }
    
    .source-name.verified {
      color: #059669;
    }
    
    .source-desc {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
    }
    
    .badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      background: #d1fae5;
      color: #059669;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 6px;
      vertical-align: middle;
    }
    
    .cell-amount {
      text-align: right;
      font-weight: 600;
      color: #059669;
      white-space: nowrap;
      width: 120px;
    }
    
    .row-total {
      background: #f0fdf4;
    }
    
    .row-total td {
      border-top: 2px solid #059669;
      border-bottom: none;
      font-weight: 700;
      padding: 16px;
    }
    
    .row-total .label {
      color: #1e293b;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    
    .row-total .amount {
      font-size: 18px;
      color: #059669;
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .footer-left {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.8;
    }
    
    .footer-right {
      text-align: right;
    }
    
    .verify-label {
      font-size: 9px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .verify-url {
      font-size: 12px;
      color: #0891B2;
      background: #f0fdfa;
      padding: 8px 12px;
      border-radius: 6px;
    }
    
    /* Disclaimer */
    .disclaimer {
      margin-top: 24px;
      padding: 14px 16px;
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      font-size: 11px;
      color: #92400e;
      line-height: 1.6;
    }
    
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page { padding: 40px 48px; }
      thead, .row-total, .badge, .divider { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="logo">${logoSvg}</div>
      <div class="header-right">
        <div class="doc-title">${templateTitle}</div>
        <div class="doc-id">${report.reportId}</div>
      </div>
    </header>
    
    <div class="divider"></div>
    
    <div class="info-row">
      <div class="info-block">
        <h3>Account Holder</h3>
        <div class="name">${userName}</div>
        ${user.businessName ? `<div class="detail">${user.businessName}</div>` : ''}
        ${addressLines.map(line => `<div class="detail">${line}</div>`).join('')}
        ${user.phone ? `<div class="detail">${user.phone}</div>` : ''}
        <div class="detail">${user.email}</div>
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Statement Period</h3>
        <div class="name">${formatShortDate(report.dateFrom)} – ${formatShortDate(report.dateTo)}</div>
        <div class="detail">Generated ${formatDate(report.createdAt)}</div>
      </div>
    </div>
    
    <div class="summary">
      <div class="summary-item">
        <span class="label">Transactions</span>
        <span class="value">${report.transactionCount}</span>
      </div>
      <div class="summary-item">
        <span class="label">Verified</span>
        <span class="value">${verifiedCount}</span>
      </div>
      <div class="summary-item">
        <span class="label">Verified Income</span>
        <span class="value">${formatCurrency(report.totalVerified)}</span>
      </div>
      <div class="summary-item total">
        <span class="label">Total Income</span>
        <span class="value">${formatCurrency(report.totalIncome)}</span>
      </div>
    </div>
    
    <div class="table-section">
      <h3>Transaction Details</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Source / Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${
            transactions.length > 0
              ? transactions
                  .map(
                    tx => `
            <tr>
              <td class="cell-date">${formatShortDate(tx.timestamp)}</td>
              <td class="cell-source">
                <div class="source-name ${tx.verifiedSender ? 'verified' : ''}">${tx.verifiedSender ? tx.verifiedSender.companyName : 'Unverified Sender'}${tx.verifiedSender ? '<span class="badge">Verified</span>' : ''}</div>
                ${tx.userLabel ? `<div class="source-desc">${tx.userLabel}</div>` : ''}
              </td>
              <td class="cell-amount">${formatCurrency(tx.amountUsd)}</td>
            </tr>
          `
                  )
                  .join('')
              : `
            <tr>
              <td colspan="3" style="text-align: center; padding: 40px; color: #94a3b8;">No transactions in this period</td>
            </tr>
          `
          }
          <tr class="row-total">
            <td colspan="2" class="label">Total Income</td>
            <td class="amount" style="text-align: right;">${formatCurrency(report.totalIncome)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <footer class="footer">
      <div class="footer-left">
        Document ID: ${report.reportId}<br>
        © ${new Date().getFullYear()} Provalo
      </div>
      <div class="footer-right">
        <div class="verify-label">Verify Online</div>
        <div class="verify-url">provalo.io/verify/${report.reportId}</div>
      </div>
    </footer>
    
    <div class="disclaimer">
      <strong>Notice:</strong> This statement is generated from blockchain records. Verified transactions are confirmed by senders. Verify independently as needed.
    </div>
  </div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            businessName: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (report.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const txHashes: string[] = JSON.parse(report.transactionIds || '[]');

    const metas = await prisma.transactionMeta.findMany({
      where: { txHash: { in: txHashes }, userId: session.user.id },
      include: { verifiedSender: { select: { companyName: true } } },
    });

    const transactions: ReportTransaction[] = metas.map(m => ({
      txHash: m.txHash,
      fromAddress: '0x' + '0'.repeat(40),
      amountUsd: report.totalIncome / (metas.length || 1),
      timestamp: m.createdAt.toISOString(),
      userLabel: m.userLabel || undefined,
      verifiedSender: m.verifiedSender
        ? { companyName: m.verifiedSender.companyName }
        : undefined,
    }));

    const html = generateReportHTML(
      { ...report, template: report.template },
      report.user,
      transactions
    );

    // Check if PDF format is requested
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    if (format === 'pdf') {
      try {
        const { generatePdfBuffer } = await import('@/lib/pdf/generatePdf');

        const pdfBuffer = await generatePdfBuffer(
          {
            reportId: report.reportId,
            title: report.title,
            dateFrom: report.dateFrom,
            dateTo: report.dateTo,
            totalIncome: report.totalIncome,
            totalVerified: report.totalVerified,
            transactionCount: report.transactionCount,
            createdAt: report.createdAt,
            template: report.template,
          },
          report.user,
          transactions
        );

        return new NextResponse(new Uint8Array(pdfBuffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${report.reportId}.pdf"`,
          },
        });
      } catch (pdfError) {
        console.error('[Report PDF] React-PDF error:', pdfError);
        // Fall back to HTML if PDF generation fails
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `inline; filename="${report.reportId}.html"`,
          },
        });
      }
    }

    // Return HTML (for preview or as fallback)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${report.reportId}.html"`,
      },
    });
  } catch (error) {
    console.error('[Report PDF] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
