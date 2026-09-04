import React, { useState, useEffect } from 'react';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { apiRequest } from '../services/api';
import { Budget } from '../types';
import { Plus, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

export const BudgetsPage: React.FC = () => {
  const { currency } = useCurrency();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string>('Food');
  const [editingAmount, setEditingAmount] = useState<number>(4000);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest('/budgets');
      if (res.success) {
        setBudgets(res.budgets);
        setTotalBudget(res.totalBudget);
        setTotalSpent(res.totalSpent);
      }
    } catch (error) {
      toast.error('Failed to load budget details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (category: string, amount: number) => {
    try {
      await apiRequest('/budgets', 'POST', { category, amount });
      toast.success('Budget saved successfully.');
      setShowModal(false);
      fetchBudgets();
    } catch (err: any) {
      toast.error('Failed to save budget.');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await apiRequest(`/budgets/${id}`, 'DELETE');
      toast.success('Budget deleted successfully.');
      fetchBudgets();
    } catch (err: any) {
      toast.error('Failed to delete budget.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Monthly Budget Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Set spending limits for each category and receive overspending alerts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory('Food');
            setEditingAmount(4000);
            setShowModal(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Overall Monthly Budget Summary Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white border border-slate-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Monthly Budget</span>
            <h3 className="text-2xl font-extrabold">{formatCurrency(totalBudget, currency)}</h3>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">Total Spent</span>
            <span className="font-bold text-slate-100">{formatCurrency(totalSpent, currency)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Remaining</span>
            <span className={`font-bold ${totalBudget - totalSpent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(Math.max(0, totalBudget - totalSpent), currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white dark:bg-slate-800 p-5 animate-pulse" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-gray-500 dark:text-slate-400 font-medium">Create a budget to start controlling your spending.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
          >
            Add Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={(budgetObj) => {
                setEditingCategory(budgetObj.category);
                setEditingAmount(budgetObj.budgetAmount);
                setShowModal(true);
              }}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBudget}
        initialCategory={editingCategory}
        initialAmount={editingAmount}
      />
    </div>
  );
};
