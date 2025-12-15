/**
 * Reports Hook
 *
 * Manages report generation and fetching
 */

import { useState, useEffect, useCallback } from 'react';

export interface Report {
  id: string;
  reportId: string;
  title: string | null;
  dateFrom: string;
  dateTo: string;
  template:
    | 'STANDARD'
    | 'VISA_APPLICATION'
    | 'RENTAL_APPLICATION'
    | 'LOAN_APPLICATION';
  pdfUrl: string | null;
  transactionIds: string;
  totalIncome: number;
  totalVerified: number;
  transactionCount: number;
  createdAt: string;
}

export interface CreateReportData {
  title?: string;
  dateFrom: Date;
  dateTo: Date;
  template?: Report['template'];
  walletId?: string;
  transactionIds: string[];
  totalIncome: number;
  totalVerified: number;
  transactionCount: number;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = useCallback(
    async (data: CreateReportData): Promise<Report | null> => {
      try {
        setIsCreating(true);
        setError(null);

        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            dateFrom: data.dateFrom.toISOString(),
            dateTo: data.dateTo.toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create report');
        }

        const result = await response.json();

        // Refresh reports list
        await fetchReports();

        return result.report;
      } catch (err) {
        console.error('Error creating report:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to create report'
        );
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchReports]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    isCreating,
    error,
    createReport,
    refreshReports: fetchReports,
  };
}
