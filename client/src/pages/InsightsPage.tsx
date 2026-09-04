import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { FinancialInsights, CategoryBreakdown, MonthlyTrend } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { TrendingUp, ShoppingBag, Calendar, Award, Zap, PieChart as PieIcon } from 'lucide-react';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import toast from 'react-hot-toast';

export const InsightsPage: React.FC = () => {
  const { currency } = useCurrency();
  const [insights, setInsights] = useState<FinancialInsights | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');

  const fetchInsightsData = async () => {
    try {
      setIsLoading(true);
      const [insRes, catRes, trendRes] = await Promise.all([
        apiRequest('/insights'),
        apiRequest(`/dashboard/category-breakdown?period=${period}`),
        apiRequest('/dashboard/monthly-trends'),
      ]);

      if (insRes.success) setInsights(insRes.insights);
      if (catRes.success) setCategoryBreakdown(catRes.breakdown);
      if (trendRes.success) setMonthlyTrends(trendRes.trends);
    } catch (error) {
      toast.error('Failed to load financial insights.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-white dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Financial Insights & Spending Trends
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Data analysis of your spending habits, top categories, and month-over-month shifts.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 self-start sm:self-auto">
          {(['month', 'year', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                period === p
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* MoM Comparison Explanation Banner */}
      {insights?.momComparisonMessage && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500 text-white mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Spending Pattern Insight</h4>
            <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200 mt-0.5">
              “{insights.momComparisonMessage}”
            </p>
          </div>
        </div>
      )}

      {/* Analytical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Spending Category */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Top Spending Category</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3">
            {insights?.topSpendingCategory?.category || 'N/A'}
          </h3>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
            {insights?.topSpendingCategory ? formatCurrency(insights.topSpendingCategory.amount, currency) : 'No expenses logged'}
          </p>
        </div>

        {/* Highest Single Expense */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Highest Expense</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3 truncate">
            {insights?.highestExpense?.description || 'N/A'}
          </h3>
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
            {insights?.highestExpense ? formatCurrency(insights.highestExpense.amount, currency) : 'No data'}
          </p>
        </div>

        {/* Average Daily Spending */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Avg Daily Spending</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3">
            {formatCurrency(insights?.averageDailySpending || 0, currency)} / day
          </h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Last 30 days average</p>
        </div>

        {/* Monthly Savings Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Monthly Savings Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-3">
            {formatPercent(insights?.monthlySavingsRate || 0)}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Income retained as savings</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categoryBreakdown} isLoading={isLoading} />
        <MonthlyBarChart data={monthlyTrends} isLoading={isLoading} />
      </div>
    </div>
  );
};
