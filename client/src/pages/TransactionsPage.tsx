import React, { useState, useEffect } from 'react';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { apiRequest } from '../services/api';
import { Transaction } from '../types';
import { Download, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [category, setCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        ...(search && { search }),
        ...(type !== 'ALL' && { type }),
        ...(category !== 'All Categories' && { category }),
        ...(dateRange !== 'all' && { dateRange }),
        ...(sortBy && { sortBy }),
        ...(minAmount && { minAmount }),
        ...(maxAmount && { maxAmount }),
        page: String(page),
        limit: '20',
      });

      const res = await apiRequest(`/transactions?${queryParams.toString()}`);
      if (res.success) {
        setTransactions(res.transactions);
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load transactions list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, type, category, dateRange, sortBy, minAmount, maxAmount, page]);

  const handleResetFilters = () => {
    setSearch('');
    setType('ALL');
    setCategory('All Categories');
    setDateRange('all');
    setSortBy('newest');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const handleSaveTransaction = async (data: any) => {
    try {
      if (editingTx) {
        await apiRequest(`/transactions/${editingTx.id}`, 'PUT', data);
        toast.success('Transaction updated successfully.');
      } else {
        await apiRequest('/transactions', 'POST', data);
        toast.success(`${data.type === 'INCOME' ? 'Income' : 'Expense'} added successfully.`);
      }
      setShowModal(false);
      setEditingTx(null);
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save transaction.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await apiRequest(`/transactions/${id}`, 'DELETE');
      toast.success('Transaction deleted successfully.');
      fetchTransactions();
    } catch (err: any) {
      toast.error('Failed to delete transaction.');
    }
  };

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
      a.download = `smart_expense_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('CSV downloaded successfully!');
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
            Transaction Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Search, filter, edit, or export your complete financial records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingTx(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters Component */}
      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        category={category}
        onCategoryChange={setCategory}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        minAmount={minAmount}
        onMinAmountChange={setMinAmount}
        maxAmount={maxAmount}
        onMaxAmountChange={setMaxAmount}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={(tx) => {
          setEditingTx(tx);
          setShowModal(true);
        }}
        onDelete={handleDeleteTransaction}
        isLoading={isLoading}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTx}
      />
    </div>
  );
};
