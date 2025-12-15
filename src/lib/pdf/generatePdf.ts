/**
 * PDF Generation using PDFKit
 * Pure Node.js solution - works in serverless
 */

import PDFDocument from 'pdfkit';

// Colors
const colors = {
  primary: '#0891B2',
  success: '#059669',
  successLight: '#10B981',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  warningBg: '#fef3c7',
  warningText: '#92400e',
};

export interface PdfTransaction {
  txHash: string;
  fromAddress: string;
  amountUsd: number;
  timestamp: string;
  userLabel?: string;
  verifiedSender?: { companyName: string };
}

export interface PdfReportData {
  reportId: string;
  title: string | null;
  dateFrom: Date;
  dateTo: Date;
  totalIncome: number;
  totalVerified: number;
  transactionCount: number;
  createdAt: Date;
  template: string;
}

export interface PdfUserData {
  name?: string | null;
  email: string;
  businessName?: string | null;
  address?: string | null;
  phone?: string | null;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatShortDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const templateTitles: Record<string, string> = {
  STANDARD: 'Income Statement',
  VISA_APPLICATION: 'Income Statement for Visa Application',
  RENTAL_APPLICATION: 'Income Statement for Rental Application',
  LOAN_APPLICATION: 'Income Statement for Loan Application',
};

export async function generatePdfBuffer(
  report: PdfReportData,
  user: PdfUserData,
  transactions: PdfTransaction[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
        info: {
          Title: report.title || 'Income Statement',
          Author: 'Provalo',
          Subject: `Income Statement ${report.reportId}`,
        },
      });

      const chunks: Uint8Array[] = [];

      doc.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      doc.on('error', (err: Error) => {
        reject(err);
      });

      const templateTitle =
        templateTitles[report.template] || 'Income Statement';
      const userName = user.name || user.email.split('@')[0];
      const addressLines =
        user.address?.split('\n').filter(l => l.trim()) || [];
      const verifiedCount = transactions.filter(tx => tx.verifiedSender).length;

      const pageWidth = 595.28; // A4
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;

      // ===== HEADER =====
      // Logo: SVG viewBox="0 0 200 80" rendered at width="115" height="48"
      // Scale factor: 115/200 = 0.575
      const pdfLogoScale = 0.45; // Smaller for PDF
      const logoX = margin;
      const logoY = 48;

      // Icon uses transform="translate(0, 8) scale(0.6)" in SVG
      const iconScale = 0.6 * pdfLogoScale;
      const iconOffsetY = 8 * pdfLogoScale;

      doc.save();

      // Back document (shadow)
      doc
        .roundedRect(
          logoX + 8 * iconScale,
          logoY + iconOffsetY + 15 * iconScale,
          58 * iconScale,
          75 * iconScale,
          8 * iconScale
        )
        .fillColor('#0891B2')
        .fillOpacity(0.2)
        .fill();
      doc.fillOpacity(1);

      // Front document
      doc
        .roundedRect(
          logoX + 16 * iconScale,
          logoY + iconOffsetY + 5 * iconScale,
          58 * iconScale,
          75 * iconScale,
          8 * iconScale
        )
        .fillColor('#0891B2')
        .fill();

      // Document lines
      doc
        .roundedRect(
          logoX + 28 * iconScale,
          logoY + iconOffsetY + 22 * iconScale,
          34 * iconScale,
          6 * iconScale,
          3 * iconScale
        )
        .fillColor('white')
        .fillOpacity(0.6)
        .fill();
      doc.fillOpacity(1);

      doc
        .roundedRect(
          logoX + 28 * iconScale,
          logoY + iconOffsetY + 38 * iconScale,
          22 * iconScale,
          6 * iconScale,
          3 * iconScale
        )
        .fillColor('white')
        .fillOpacity(0.6)
        .fill();
      doc.fillOpacity(1);

      // Badge background circle
      doc
        .circle(
          logoX + 66 * iconScale,
          logoY + iconOffsetY + 70 * iconScale,
          25 * iconScale
        )
        .fillColor('#1e293b')
        .fill();

      // Badge inner circle
      doc
        .circle(
          logoX + 66 * iconScale,
          logoY + iconOffsetY + 70 * iconScale,
          21 * iconScale
        )
        .fillColor('#059669')
        .fill();

      // Checkmark
      doc
        .strokeColor('white')
        .lineWidth(6 * iconScale)
        .lineCap('round')
        .lineJoin('round');
      doc
        .moveTo(logoX + 54 * iconScale, logoY + iconOffsetY + 70 * iconScale)
        .lineTo(logoX + 62 * iconScale, logoY + iconOffsetY + 78 * iconScale)
        .lineTo(logoX + 78 * iconScale, logoY + iconOffsetY + 62 * iconScale)
        .stroke();

      doc.restore();

      // Calculate icon dimensions for text positioning
      const iconHeight = 80 * pdfLogoScale; // Full viewBox height scaled
      const iconWidth = 58 * pdfLogoScale; // Approximate icon width

      // Text "provalo" - positioned to align vertically with icon center
      const textX = logoX + iconWidth + 1;
      const textFontSize = 18;
      const textY = logoY + iconHeight / 2 - textFontSize / 2 - 2;
      doc.font('Helvetica-Bold').fontSize(textFontSize).fillColor('#1e293b');
      doc.text('pro', textX, textY, { continued: true });
      doc.fillColor('#0891B2').text('v', { continued: true });
      doc.fillColor('#1e293b').text('alo', { continued: false });

      // Document title (right side)
      const rightTextY = logoY + iconHeight / 2 - 12;
      doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.slate800);
      doc.text(templateTitle, margin, rightTextY, {
        align: 'right',
        width: contentWidth,
      });
      doc.font('Helvetica').fontSize(10).fillColor(colors.slate500);
      doc.text(report.reportId, margin, rightTextY + 18, {
        align: 'right',
        width: contentWidth,
      });

      // Divider line
      const dividerY = logoY + iconHeight + 8;
      doc
        .moveTo(margin, dividerY)
        .lineTo(margin + contentWidth / 2, dividerY)
        .strokeColor(colors.primary)
        .lineWidth(3)
        .stroke();
      doc
        .moveTo(margin + contentWidth / 2, dividerY)
        .lineTo(pageWidth - margin, dividerY)
        .strokeColor(colors.success)
        .lineWidth(3)
        .stroke();

      let y = dividerY + 20;

      // ===== INFO ROW =====
      // Equal width columns (48% each with gap)
      const colGap = 24;
      const infoColWidth = (contentWidth - colGap) / 2;
      const rightColX = margin + infoColWidth + colGap;

      // Left side - Account Holder
      const leftStartY = y;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.slate400);
      doc.text('ACCOUNT HOLDER', margin, y, { width: infoColWidth });
      y += 16;

      doc.font('Helvetica-Bold').fontSize(15).fillColor(colors.slate800);
      doc.text(userName, margin, y, { width: infoColWidth });
      y += 20;

      doc.font('Helvetica').fontSize(11).fillColor(colors.slate500);
      if (user.businessName) {
        doc.text(user.businessName, margin, y, { width: infoColWidth });
        y += 15;
      }
      addressLines.forEach(line => {
        doc.text(line, margin, y, { width: infoColWidth });
        y += 15;
      });
      if (user.phone) {
        doc.text(user.phone, margin, y, { width: infoColWidth });
        y += 15;
      }
      doc.text(user.email, margin, y, { width: infoColWidth });
      const leftEndY = y + 15;

      // Right side - Statement Period
      let rightY = leftStartY;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.slate400);
      doc.text('STATEMENT PERIOD', rightColX, rightY, {
        width: infoColWidth,
        align: 'right',
      });
      rightY += 16;

      doc.font('Helvetica-Bold').fontSize(15).fillColor(colors.slate800);
      doc.text(
        `${formatShortDate(report.dateFrom)} - ${formatShortDate(report.dateTo)}`,
        rightColX,
        rightY,
        { width: infoColWidth, align: 'right' }
      );
      rightY += 20;

      doc.font('Helvetica').fontSize(11).fillColor(colors.slate500);
      doc.text(`Generated ${formatDate(report.createdAt)}`, rightColX, rightY, {
        width: infoColWidth,
        align: 'right',
      });

      y = Math.max(leftEndY, rightY) + 25;

      // ===== SUMMARY BOX =====
      const summaryHeight = 55;
      doc
        .roundedRect(margin, y, contentWidth, summaryHeight, 6)
        .fillColor(colors.slate50)
        .fill();

      const summaryY = y + 14;
      const colWidth = contentWidth / 4;

      // Transactions
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.slate400);
      doc.text('TRANSACTIONS', margin + 15, summaryY);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.slate800);
      doc.text(report.transactionCount.toString(), margin + 15, summaryY + 14);

      // Verified
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.slate400);
      doc.text('VERIFIED', margin + colWidth + 15, summaryY);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.slate800);
      doc.text(verifiedCount.toString(), margin + colWidth + 15, summaryY + 14);

      // Verified Income
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.slate400);
      doc.text('VERIFIED INCOME', margin + colWidth * 2 + 15, summaryY);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.slate800);
      doc.text(
        formatCurrency(report.totalVerified),
        margin + colWidth * 2 + 15,
        summaryY + 14
      );

      // Total Income
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.slate400);
      doc.text('TOTAL INCOME', margin + colWidth * 3 - 15, summaryY, {
        width: colWidth,
        align: 'right',
      });
      doc.font('Helvetica-Bold').fontSize(18).fillColor(colors.success);
      doc.text(
        formatCurrency(report.totalIncome),
        margin + colWidth * 3 - 15,
        summaryY + 12,
        { width: colWidth, align: 'right' }
      );

      y += summaryHeight + 28;

      // ===== TABLE =====
      doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.slate400);
      doc.text('TRANSACTION DETAILS', margin, y);
      y += 18;

      // Table container with rounded corners
      const tableX = margin;
      const col1Width = 85; // Date
      const col3Width = 95; // Amount
      const col2Width = contentWidth - col1Width - col3Width; // Source

      // Table header
      doc
        .roundedRect(tableX, y, contentWidth, 30, 4)
        .fillColor(colors.primary)
        .fill();

      doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.white);
      doc.text('DATE', tableX + 12, y + 10);
      doc.text('SOURCE / DESCRIPTION', tableX + col1Width + 12, y + 10);
      doc.text('AMOUNT', tableX + col1Width + col2Width, y + 10, {
        width: col3Width - 12,
        align: 'right',
      });

      y += 30;

      // Table rows
      if (transactions.length > 0) {
        transactions.forEach((tx, index) => {
          const rowHeight = tx.userLabel ? 40 : 32;

          // Alternate row background
          if (index % 2 === 1) {
            doc
              .rect(tableX, y, contentWidth, rowHeight)
              .fillColor('#fafafa')
              .fill();
          }

          // Row border
          doc
            .moveTo(tableX, y + rowHeight)
            .lineTo(tableX + contentWidth, y + rowHeight)
            .strokeColor(colors.slate100)
            .lineWidth(1)
            .stroke();

          // Date
          doc.font('Helvetica').fontSize(11).fillColor(colors.slate500);
          doc.text(formatShortDate(tx.timestamp), tableX + 12, y + 10);

          // Source
          if (tx.verifiedSender) {
            doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.success);
            doc.text(
              tx.verifiedSender.companyName,
              tableX + col1Width + 12,
              y + 10,
              { continued: true }
            );
            doc.font('Helvetica').fontSize(9).fillColor(colors.success);
            doc.text('  [Verified]', { continued: false });
          } else {
            doc.font('Helvetica').fontSize(11).fillColor(colors.slate700);
            doc.text('Unverified Sender', tableX + col1Width + 12, y + 10);
          }

          if (tx.userLabel) {
            doc
              .font('Helvetica-Oblique')
              .fontSize(10)
              .fillColor(colors.slate500);
            doc.text(tx.userLabel, tableX + col1Width + 12, y + 24, {
              width: col2Width - 20,
            });
          }

          // Amount
          doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.success);
          doc.text(
            formatCurrency(tx.amountUsd),
            tableX + col1Width + col2Width,
            y + 10,
            { width: col3Width - 12, align: 'right' }
          );

          y += rowHeight;
        });
      } else {
        doc.rect(tableX, y, contentWidth, 55).fillColor(colors.white).fill();
        doc.font('Helvetica').fontSize(11).fillColor(colors.slate400);
        doc.text('No transactions in this period', tableX, y + 22, {
          width: contentWidth,
          align: 'center',
        });
        y += 55;
      }

      // Total row
      doc
        .roundedRect(tableX, y, contentWidth, 40, 4)
        .fillColor('#ecfdf5')
        .fill();
      doc
        .moveTo(tableX, y)
        .lineTo(tableX + contentWidth, y)
        .strokeColor(colors.success)
        .lineWidth(2)
        .stroke();

      doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.slate800);
      doc.text('TOTAL INCOME', tableX + 12, y + 14);

      doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.success);
      doc.text(
        formatCurrency(report.totalIncome),
        tableX + col1Width + col2Width,
        y + 12,
        { width: col3Width - 12, align: 'right' }
      );

      y += 55;

      // ===== FOOTER =====
      doc.font('Helvetica').fontSize(10).fillColor(colors.slate400);
      doc.text(`Document ID: ${report.reportId}`, margin, y);
      doc.text(`© ${new Date().getFullYear()} Provalo`, margin, y + 14);

      // Right side - Verify
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.slate400);
      doc.text('VERIFY ONLINE', pageWidth - margin - 160, y, {
        width: 160,
        align: 'right',
      });

      // Verify URL box
      doc
        .roundedRect(pageWidth - margin - 160, y + 14, 160, 24, 4)
        .fillColor('#f0fdfa')
        .fill();
      doc.font('Helvetica').fontSize(10).fillColor(colors.primary);
      doc.text(
        `provalo.io/verify/${report.reportId}`,
        pageWidth - margin - 155,
        y + 21,
        { width: 150, align: 'center' }
      );

      y += 55;

      // ===== DISCLAIMER =====
      doc
        .roundedRect(margin, y, contentWidth, 45, 4)
        .fillColor(colors.warningBg)
        .fill();
      doc.rect(margin, y, 4, 45).fillColor('#f59e0b').fill();

      doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.warningText);
      doc.text('Notice: ', margin + 14, y + 14, { continued: true });
      doc
        .font('Helvetica')
        .text(
          'This statement is generated from blockchain records. Verified transactions are confirmed by senders. Verify independently as needed.',
          { width: contentWidth - 28 }
        );

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
