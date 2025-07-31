import { useState, useCallback } from 'react';
import type { Report } from '../types';
import { reportsAPI } from '../services/api';

export const useReports = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsAPI.getReport(startDate, endDate);
      setReport(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  return {
    report,
    loading,
    error,
    generateReport,
    clearReport,
  };
}; 