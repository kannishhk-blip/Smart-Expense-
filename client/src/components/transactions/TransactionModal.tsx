import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, CreditCard, FileText, Link as LinkIcon } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Transaction | null;
  defaultType?: TransactionType;
}

const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Rent',
  'Subscriptions',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Allowance',
  'Investment',
  'Other',
];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultType = 'EXPENSE',
}) => {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDescription(initialData.description);
      setTransactionDate(initialData.transactionDate.split('T')[0]);
      setPaymentMethod(initialData.paymentMethod);
      setNotes(initialData.notes || '');
      setReceiptUrl(initialData.receiptUrl || '');
    } else {
      setType(defaultType);
      setAmount('');
      setCategory(defaultType === 'EXPENSE' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
      setDescription('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setNotes('');
      setReceiptUrl('');
    }
    setError(null);
  }, [initialData, defaultType, isOpen]);

  useEffect(() => {
    const categories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        type,
        amount: numAmount,
        category,
        description: description.trim(),
        transactionDate: transactionDate ? new Date(transactionDate).toISOString() : new Date().toISOString(),
        paymentMethod,
        notes: notes.trim() || null,
        receiptUrl: receiptUrl.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {initialData ? 'Edit Transaction' : type === 'INCOME' ? 'Add Income' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector Toggle */}
          <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Lunch at college canteen"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Date & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Optional Notes
            </label>
            <textarea
              rows={2}
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Receipt URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
              Receipt / Invoice Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/receipt.jpg"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-all ${
                type === 'INCOME'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/25'
              }`}
            >
              {isSubmitting ? 'Saving Transaction...' : initialData ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
