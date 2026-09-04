import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { MonthlyReport } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { Download, FileText, TrendingUp, Calendar, Award, Receipt, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ReportsPage: React.FC = () => {
  const { currency } = useCurrency();
  const now = new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest(`/reports/monthly?month=${selectedMonth}&year=${selectedYear}`);
      if (res.success) {
        setReport(res.report);
      }
    } catch (error) {
      toast.error('Failed to generate monthly report.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Export failed.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly_report_${selectedMonth}_${selectedYear}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Report CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Monthly Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Generate and export comprehensive statements for any month.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : !report ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-slate-700">
          <p className="text-gray-500 dark:text-slate-400">No report data for the selected period.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Executive Financial Summary</span>
                <h2 className="text-2xl font-black mt-0.5">
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear} Report
                </h2>
              </div>
              <FileText className="w-8 h-8 text-emerald-400 opacity-80" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-slate-400 block">Total Income</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatCurrency(report.totalIncome, currency)}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Total Expenses</span>
                <span className="text-2xl font-extrabold text-rose-400">{formatCurrency(report.totalExpenses, currency)}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Net Savings</span>
                <span className={`text-2xl font-extrabold ${report.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(report.netSavings, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Highest Spending Category */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Highest Category</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                {report.highestSpendingCategory?.category || 'None'}
              </p>
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                {report.highestSpendingCategory ? formatCurrency(report.highestSpendingCategory.amount, currency) : '₹0'}
              </span>
            </div>

            {/* Average Expense */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 mb-2">
                <Receipt className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Transaction Metrics</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                {formatCurrency(report.averageExpense, currency)} / avg tx
              </p>
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                {report.transactionCount} total transactions logged
              </span>
            </div>

            {/* Budget Utilization Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Budget Performance</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                {report.budgetPerformance.utilizationPct}% Budget Utilized
              </p>
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                Spent {formatCurrency(report.budgetPerformance.totalSpent, currency)} of {formatCurrency(report.budgetPerformance.totalBudget, currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
