import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { GoalModal } from '../components/savings/GoalModal';
import { apiRequest } from '../services/api';
import { DashboardSummary, CategoryBreakdown, MonthlyTrend, Transaction, TransactionType } from '../types';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [showTxModal, setShowTxModal] = useState(false);
  const [txDefaultType, setTxDefaultType] = useState<TransactionType>('EXPENSE');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, catRes, trendRes, txRes] = await Promise.all([
        apiRequest('/dashboard/summary'),
        apiRequest('/dashboard/category-breakdown?period=month'),
        apiRequest('/dashboard/monthly-trends'),
        apiRequest('/transactions?limit=5&sortBy=newest'),
      ]);

      if (sumRes.success) setSummary(sumRes.summary);
      if (catRes.success) setCategoryBreakdown(catRes.breakdown);
      if (trendRes.success) setMonthlyTrends(trendRes.trends);
      if (txRes.success) setRecentTransactions(txRes.transactions);
    } catch (error) {
      toast.error('Failed to update dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveTransaction = async (data: any) => {
    try {
      if (editingTx) {
        await apiRequest(`/transactions/${editingTx.id}`, 'PUT', data);
        toast.success('Transaction updated successfully.');
      } else {
        await apiRequest('/transactions', 'POST', data);
        toast.success(`${data.type === 'INCOME' ? 'Income' : 'Expense'} added successfully.`);
      }
      setEditingTx(null);
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save transaction.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await apiRequest(`/transactions/${id}`, 'DELETE');
      toast.success('Transaction deleted successfully.');
      fetchDashboardData();
    } catch (err: any) {
      toast.error('Failed to delete transaction.');
    }
  };

  const handleSaveBudget = async (category: string, amount: number) => {
    try {
      await apiRequest('/budgets', 'POST', { category, amount });
      toast.success('Budget saved successfully.');
      fetchDashboardData();
    } catch (err: any) {
      toast.error('Failed to set budget.');
    }
  };

  const handleSaveGoal = async (data: any) => {
    try {
      await apiRequest('/savings-goals', 'POST', data);
      toast.success('Savings goal created successfully.');
      fetchDashboardData();
    } catch (err: any) {
      toast.error('Failed to create savings goal.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Here is your financial overview for this month.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingTx(null);
              setTxDefaultType('EXPENSE');
              setShowTxModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 font-bold text-xs text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-red-700 transition-all"
          >
            + Add Expense
          </button>
          <button
            onClick={() => {
              setEditingTx(null);
              setTxDefaultType('INCOME');
              setShowTxModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            + Add Income
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} isLoading={isLoading} />

      {/* Quick Actions */}
      <QuickActions
        onAddIncome={() => {
          setEditingTx(null);
          setTxDefaultType('INCOME');
          setShowTxModal(true);
        }}
        onAddExpense={() => {
          setEditingTx(null);
          setTxDefaultType('EXPENSE');
          setShowTxModal(true);
        }}
        onSetBudget={() => setShowBudgetModal(true)}
        onAddGoal={() => setShowGoalModal(true)}
      />

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categoryBreakdown} isLoading={isLoading} />
        <MonthlyBarChart data={monthlyTrends} isLoading={isLoading} />
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Recent Transactions</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Your latest logged income and expenses</p>
          </div>
          <Link
            to="/transactions"
            className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable
          transactions={recentTransactions}
          onEdit={(tx) => {
            setEditingTx(tx);
            setShowTxModal(true);
          }}
          onDelete={handleDeleteTransaction}
          isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => {
          setShowTxModal(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTx}
        defaultType={txDefaultType}
      />

      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleSaveBudget}
      />

      <GoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSave={handleSaveGoal}
      />
    </div>
  );
};
