import React, { useState } from 'react';
import { X, PiggyBank } from 'lucide-react';
import { SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface AddFundsModalProps {
  goal: SavingsGoal | null;
  onClose: () => void;
  onDeposit: (goalId: string, amount: number) => Promise<void>;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ goal, onClose, onDeposit }) => {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const addNum = parseFloat(amount);
    if (isNaN(addNum) || addNum <= 0) {
      setError('Please enter a valid deposit amount greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onDeposit(goal.id, addNum);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add money.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Add Money to Goal</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <p className="text-xs font-semibold text-purple-800 dark:text-purple-300">{goal.name}</p>
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 mt-1">
            <span>Target: {formatCurrency(goal.targetAmount, currency)}</span>
            <span>Current: {formatCurrency(goal.currentAmount, currency)}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Deposit Amount (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all"
            >
              {isSubmitting ? 'Processing Deposit...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
