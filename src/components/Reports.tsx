import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, DollarSign, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Reporte } from '../types';
import { reportesAPI } from '../services/api';

const Reports: React.FC = () => {
  const [report, setReport] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    loadReport();
  }, [dateRange]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await reportesAPI.obtenerReporte(dateRange.startDate, dateRange.endDate);
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const exportReport = () => {
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Métricas</h1>
          <p className="text-gray-600">Análisis del rendimiento del bot y las ventas</p>
        </div>
        <button
          onClick={exportReport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Desde:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Hasta:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {report && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Conversaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{report.total_conversaciones}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Ventas Cerradas</p>
                  <p className="text-2xl font-bold text-gray-900">{report.conversaciones_clasificadas.venta_cerrada}</p>
                  <p className="text-sm text-gray-500">
                    {getPercentage(report.conversaciones_clasificadas.venta_cerrada, report.total_conversaciones)}% del total
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tiempo Respuesta</p>
                  <p className="text-2xl font-bold text-gray-900">{report.tiempo_respuesta_promedio} min</p>
                  <p className="text-sm text-gray-500">Promedio</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Satisfacción</p>
                  <p className="text-2xl font-bold text-gray-900">{report.satisfaccion_cliente}/5</p>
                  <p className="text-sm text-gray-500">Calificación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Classification Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Clasificación de Conversaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Venta Cerrada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${getPercentage(report.conversaciones_clasificadas.venta_cerrada, report.total_conversaciones)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {report.conversaciones_clasificadas.venta_cerrada}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Cliente Interesado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${getPercentage(report.conversaciones_clasificadas.cliente_interesado, report.total_conversaciones)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {report.conversaciones_clasificadas.cliente_interesado}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Requiere Seguimiento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${getPercentage(report.conversaciones_clasificadas.requiere_seguimiento, report.total_conversaciones)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {report.conversaciones_clasificadas.requiere_seguimiento}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Información Solicitada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width: `${getPercentage(report.conversaciones_clasificadas.informacion_solicitada, report.total_conversaciones)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {report.conversaciones_clasificadas.informacion_solicitada}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento del Bot</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de Conversión</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getPercentage(report.conversaciones_clasificadas.venta_cerrada, report.total_conversaciones)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo Respuesta Promedio</span>
                  <span className="text-sm font-medium text-gray-900">{report.tiempo_respuesta_promedio} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfacción Cliente</span>
                  <span className="text-sm font-medium text-gray-900">{report.satisfaccion_cliente}/5</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del Período</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(dateRange.startDate), 'dd/MM/yyyy', { locale: es })} - {format(new Date(dateRange.endDate), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversaciones por día</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(report.total_conversaciones / 30)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ventas por día</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(report.conversaciones_clasificadas.venta_cerrada / 30)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports; 