export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  id?: string;
  currency: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  budgetAlertsEnabled: boolean;
  monthlyReportsEnabled: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  transactionDate: string;
  notes?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  budgetAmount: number;
  amountSpent: number;
  remainingAmount: number;
  percentageUsed: number;
  alertStatus: 'NORMAL' | 'WARNING' | 'EXCEEDED';
  month: number;
  year: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description?: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'BUDGET_WARNING' | 'BUDGET_EXCEEDED' | 'GOAL_ACHIEVED' | 'INFO';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  monthIndex: number;
  income: number;
  expense: number;
  savings: number;
}

export interface FinancialInsights {
  topSpendingCategory: { category: string; amount: number } | null;
  highestExpense: { description: string; amount: number; category: string; date: string } | null;
  averageDailySpending: number;
  monthlySavingsRate: number;
  momComparisonMessage: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  highestSpendingCategory: { category: string; amount: number } | null;
  transactionCount: number;
  averageExpense: number;
  budgetPerformance: {
    totalBudget: number;
    totalSpent: number;
    utilizationPct: number;
  };
}
