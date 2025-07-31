import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, DollarSign, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { Report } from '../types';
import { reportsAPI } from '../services/api';
import { Card, CardHeader, CardBody } from './ui/Card';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';

const Reports: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
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
      const data = await reportsAPI.getReport(dateRange.startDate, dateRange.endDate);
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
      ['Metric', 'Value'],
      ['Total Conversations', report.total_conversations.toString()],
      ['Closed Sales', report.classified_conversations.closed_sale.toString()],
      ['Interested Customers', report.classified_conversations.interested_customer.toString()],
      ['Requires Follow-up', report.classified_conversations.requires_followup.toString()],
      ['Information Requested', report.classified_conversations.information_requested.toString()],
      ['Average Response Time (min)', report.average_response_time.toString()],
      ['Customer Satisfaction', report.customer_satisfaction.toString()],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange.startDate}-${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Metrics</h1>
          <p className="text-gray-600 dark:text-gray-400">AI bot performance and sales analysis</p>
        </div>
        <Button
          onClick={exportReport}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {report && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.total_conversations}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.classified_conversations.closed_sale}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getPercentage(report.classified_conversations.closed_sale, report.total_conversations)}% of total
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.average_response_time}m</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.customer_satisfaction}/5</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Conversation Classification */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Conversation Classification</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{report.classified_conversations.closed_sale}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Closed Sales</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {getPercentage(report.classified_conversations.closed_sale, report.total_conversations)}%
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{report.classified_conversations.interested_customer}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Interested Customers</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {getPercentage(report.classified_conversations.interested_customer, report.total_conversations)}%
                  </div>
                </div>

                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{report.classified_conversations.requires_followup}</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">Requires Follow-up</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    {getPercentage(report.classified_conversations.requires_followup, report.total_conversations)}%
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{report.classified_conversations.information_requested}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Information Requested</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {getPercentage(report.classified_conversations.information_requested, report.total_conversations)}%
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Performance Overview</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Conversion Rate</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {getPercentage(report.classified_conversations.closed_sale, report.total_conversations)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{ width: `${getPercentage(report.classified_conversations.closed_sale, report.total_conversations)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Interest Rate</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {getPercentage(report.classified_conversations.interested_customer, report.total_conversations)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getPercentage(report.classified_conversations.interested_customer, report.total_conversations)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Required</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {getPercentage(report.classified_conversations.requires_followup, report.total_conversations)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${getPercentage(report.classified_conversations.requires_followup, report.total_conversations)}%` }}
                  ></div>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports; 