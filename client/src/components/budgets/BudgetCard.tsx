import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { Budget } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const { currency } = useCurrency();
  const { category, budgetAmount, amountSpent, remainingAmount, percentageUsed, alertStatus } = budget;

  // Determine progress bar color & alert banner
  let progressBarColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  let alertBanner = null;

  if (alertStatus === 'EXCEEDED') {
    progressBarColor = 'bg-rose-500';
    badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
    const overspent = amountSpent - budgetAmount;
    alertBanner = (
      <div className="flex items-center space-x-1.5 mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900/50">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>You have exceeded your {category} budget by {formatCurrency(overspent, currency)}.</span>
      </div>
    );
  } else if (alertStatus === 'WARNING') {
    progressBarColor = 'bg-amber-500';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    alertBanner = (
      <div className="flex items-center space-x-1.5 mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-900/50">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>You have used {percentageUsed}% of your {category} budget.</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">{category}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
            {percentageUsed}% used
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Edit Budget"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Delete Budget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressBarColor} transition-all duration-300 rounded-full`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Financial Details */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs border-t border-gray-100 dark:border-slate-700/50 pt-3">
        <div>
          <span className="text-gray-400 dark:text-slate-500 block">Budgeted</span>
          <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">{formatCurrency(budgetAmount, currency)}</span>
        </div>
        <div>
          <span className="text-gray-400 dark:text-slate-500 block">Spent</span>
          <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">{formatCurrency(amountSpent, currency)}</span>
        </div>
        <div>
          <span className="text-gray-400 dark:text-slate-500 block">Remaining</span>
          <span className={`font-bold mt-0.5 block ${remainingAmount === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(remainingAmount, currency)}
          </span>
        </div>
      </div>

      {alertBanner}
    </div>
  );
};
