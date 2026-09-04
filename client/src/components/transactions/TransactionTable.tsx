import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Eye, ExternalLink, Calendar, CreditCard, Tag } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const { currency } = useCurrency();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-white dark:bg-slate-800 animate-pulse border border-gray-100 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-400 mb-3">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No transactions found.</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No records match your criteria. Add a transaction or reset filters.
        </p>
      </div>
    );
  }

  const handleDeleteConfirm = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  return (
    <>
      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50 text-sm">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'INCOME';
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 text-gray-600 dark:text-slate-300 font-medium whitespace-nowrap">
                      {formatDate(tx.transactionDate)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                      {tx.description}
                      {tx.notes && <span className="block text-xs font-normal text-gray-400 dark:text-slate-500 truncate">{tx.notes}</span>}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {tx.paymentMethod}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(tx.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'INCOME';
          return (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isIncome ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  }`}
                >
                  {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white max-w-[150px] truncate">
                    {tx.description}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    <span>{formatDate(tx.transactionDate)}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`block font-extrabold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </span>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(tx.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details View Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Transaction Details</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
              <p><strong>Description:</strong> {selectedTx.description}</p>
              <p><strong>Type:</strong> {selectedTx.type}</p>
              <p><strong>Category:</strong> {selectedTx.category}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedTx.amount, currency)}</p>
              <p><strong>Payment Method:</strong> {selectedTx.paymentMethod}</p>
              <p><strong>Date:</strong> {formatDate(selectedTx.transactionDate)}</p>
              {selectedTx.notes && <p><strong>Notes:</strong> {selectedTx.notes}</p>}
              {selectedTx.receiptUrl && (
                <p>
                  <strong>Receipt:</strong>{' '}
                  <a href={selectedTx.receiptUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline flex items-center inline-flex">
                    View Receipt <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl font-medium text-gray-800 dark:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
              Are you sure you want to delete this transaction?
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              This action cannot be undone. All relevant budget calculations will be updated.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-md shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
