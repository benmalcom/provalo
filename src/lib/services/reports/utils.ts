/**
 * Report utility functions
 */

/**
 * Generate a unique report ID in format: PV-YYYY-XXXXXX
 */
export function generateReportId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O, 0, 1, I to avoid confusion
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PV-${year}-${suffix}`;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for reports
 */
export function formatReportDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date range for reports
 */
export function formatDateRange(from: Date, to: Date): string {
  return `${formatReportDate(from)} - ${formatReportDate(to)}`;
}
