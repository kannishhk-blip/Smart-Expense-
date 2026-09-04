import React, { useState, useEffect } from 'react';
import { GoalCard } from '../components/savings/GoalCard';
import { GoalModal } from '../components/savings/GoalModal';
import { AddFundsModal } from '../components/savings/AddFundsModal';
import { apiRequest } from '../services/api';
import { SavingsGoal } from '../types';
import { Plus, PiggyBank } from 'lucide-react';
import toast from 'react-hot-toast';

export const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest('/savings-goals');
      if (res.success) {
        setGoals(res.goals);
      }
    } catch (error) {
      toast.error('Failed to load savings goals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (data: any) => {
    try {
      if (editingGoal) {
        await apiRequest(`/savings-goals/${editingGoal.id}`, 'PUT', data);
        toast.success('Savings goal updated successfully.');
      } else {
        await apiRequest('/savings-goals', 'POST', data);
        toast.success('Savings goal created successfully.');
      }
      setShowGoalModal(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save goal.');
    }
  };

  const handleAddFunds = async (goalId: string, amount: number) => {
    try {
      const res = await apiRequest(`/savings-goals/${goalId}/add-funds`, 'POST', { amount });
      toast.success(res.message || 'Funds added successfully!');
      setDepositGoal(null);
      fetchGoals();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add funds.');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await apiRequest(`/savings-goals/${id}`, 'DELETE');
      toast.success('Savings goal deleted successfully.');
      fetchGoals();
    } catch (err: any) {
      toast.error('Failed to delete goal.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Savings Goals
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Set target savings milestones, deposit funds, and track your progress.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null);
            setShowGoalModal(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-xs text-white shadow-md shadow-purple-500/20 hover:from-purple-600 hover:to-indigo-700 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Savings Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white dark:bg-slate-800 p-5 animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set a savings goal and start working toward it.</h3>
          <button
            onClick={() => setShowGoalModal(true)}
            className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/20"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onAddMoney={(goalObj) => setDepositGoal(goalObj)}
              onEdit={(goalObj) => {
                setEditingGoal(goalObj);
                setShowGoalModal(true);
              }}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />

      {/* Add Funds Modal */}
      <AddFundsModal
        goal={depositGoal}
        onClose={() => setDepositGoal(null)}
        onDeposit={handleAddFunds}
      />
    </div>
  );
};
