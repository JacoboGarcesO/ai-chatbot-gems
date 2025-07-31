import { useState, useEffect, useCallback } from 'react';
import type { Reporte } from '../types';
import { reportesAPI } from '../services/api';

interface DateRange {
  startDate: string;
  endDate: string;
}

export const useReports = (initialDateRange?: DateRange) => {
  const [report, setReport] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    }
  );

  const loadReport = useCallback(async (range?: DateRange) => {
    const targetRange = range || dateRange;

    try {
      setLoading(true);
      setError(null);
      const data = await reportesAPI.obtenerReporte(targetRange.startDate, targetRange.endDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading report');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const updateDateRange = useCallback((newRange: DateRange) => {
    setDateRange(newRange);
    loadReport(newRange);
  }, [loadReport]);

  const exportReport = useCallback(() => {
    if (!report) return;

    const csvContent = [
      ['Métrica', 'Valor'],
      ['Total Conversaciones', report.total_conversaciones.toString()],
      ['Ventas Cerradas', report.conversaciones_clasificadas.venta_cerrada.toString()],
      ['Clientes Interesados', report.conversaciones_clasificadas.cliente_interesado.toString()],
      ['Requiere Seguimiento', report.conversaciones_clasificadas.requiere_seguimiento.toString()],
      ['Información Solicitada', report.conversaciones_clasificadas.informacion_solicitada.toString()],
      ['Tiempo Respuesta Promedio (min)', report.tiempo_respuesta_promedio.toString()],
      ['Satisfacción Cliente', report.satisfaccion_cliente.toString()],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${dateRange.startDate}-${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [report, dateRange]);

  const getPercentage = useCallback((value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return {
    report,
    loading,
    error,
    dateRange,
    loadReport,
    updateDateRange,
    exportReport,
    getPercentage,
  };
}; 