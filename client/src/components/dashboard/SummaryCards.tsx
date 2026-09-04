import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Percent } from 'lucide-react';
import { DashboardSummary } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  isLoading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  const { currency } = useCurrency();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white dark:bg-slate-800 p-5 animate-pulse border border-gray-100 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Income',
      amount: formatCurrency(summary.totalIncome, currency),
      icon: ArrowUpRight,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      tag: 'Incoming',
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(summary.totalExpenses, currency),
      icon: ArrowDownRight,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      tag: 'Outgoing',
    },
    {
      title: 'Remaining Balance',
      amount: formatCurrency(summary.balance, currency),
      icon: Wallet,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      tag: summary.balance >= 0 ? 'Surplus' : 'Deficit',
    },
    {
      title: 'Savings & Rate',
      amount: formatCurrency(summary.savings, currency),
      subtext: `Savings Rate: ${formatPercent(summary.savingsRate)}`,
      icon: PiggyBank,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      tag: formatPercent(summary.savingsRate),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.textColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {card.amount}
              </h3>
              {card.subtext ? (
                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {card.subtext}
                </p>
              ) : (
                <span className="mt-1 inline-block text-xs font-medium text-gray-400 dark:text-slate-500">
                  {card.tag}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
