import React from 'react';
import { Plus, CheckCircle2, Edit2, Trash2, Calendar, Target } from 'lucide-react';
import { SavingsGoal } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface GoalCardProps {
  goal: SavingsGoal;
  onAddMoney: (goal: SavingsGoal) => void;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAddMoney, onEdit, onDelete }) => {
  const { currency } = useCurrency();
  const { name, targetAmount, currentAmount, targetDate, description, status, progress } = goal;
  const isCompleted = status === 'COMPLETED' || currentAmount >= targetAmount;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{name}</h3>
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                In Progress
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Edit Goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amounts */}
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-gray-400 dark:text-slate-500">Saved</span>
          <p className="text-xl font-extrabold text-gray-900 dark:text-white">
            {formatCurrency(currentAmount, currency)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 dark:text-slate-500">Target</span>
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            {formatCurrency(targetAmount, currency)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'} transition-all duration-300 rounded-full`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {/* Target Date & Add Money Button */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Target: {formatDate(targetDate)}</span>
        </div>

        {!isCompleted && (
          <button
            onClick={() => onAddMoney(goal)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>
        )}
      </div>
    </div>
  );
};
