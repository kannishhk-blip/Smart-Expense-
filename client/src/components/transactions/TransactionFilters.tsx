import React from 'react';
import { Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  minAmount: string;
  onMinAmountChange: (val: string) => void;
  maxAmount: string;
  onMaxAmountChange: (val: string) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'All Categories',
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Rent',
  'Subscriptions',
  'Salary',
  'Freelance',
  'Business',
  'Allowance',
  'Investment',
  'Other',
];

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by description, category, or payment method..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      </div>

      {/* Filter Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expenses Only</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Time Period
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_amount">Highest Amount</option>
            <option value="lowest_amount">Lowest Amount</option>
            <option value="a_z">Alphabetical (A-Z)</option>
            <option value="z_a">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Filter Row 2: Amount Range & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Amount Range:</span>
          <input
            type="number"
            placeholder="Min ₹"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span className="text-gray-400 dark:text-slate-500 text-xs">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
