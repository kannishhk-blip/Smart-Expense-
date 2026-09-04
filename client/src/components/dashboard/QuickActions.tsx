import React from 'react';
import { PlusCircle, MinusCircle, PieChart, PiggyBank } from 'lucide-react';

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onSetBudget: () => void;
  onAddGoal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddIncome,
  onAddExpense,
  onSetBudget,
  onAddGoal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onAddIncome}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-900/40 group"
        >
          <PlusCircle className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold">Add Income</span>
        </button>

        <button
          onClick={onAddExpense}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors border border-rose-100 dark:border-rose-900/40 group"
        >
          <MinusCircle className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-semibold">Add Expense</span>
        </button>

        <button
          onClick={onSetBudget}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-900/40 group"
        >
          <PieChart className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold">Set Budget</span>
        </button>

        <button
          onClick={onAddGoal}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-100 dark:border-purple-900/40 group"
        >
          <PiggyBank className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold">Add Savings Goal</span>
        </button>
      </div>
    </div>
  );
};
