import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryBreakdown } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
  isLoading?: boolean;
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#64748b', // slate
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, isLoading }) => {
  const { currency } = useCurrency();

  if (isLoading) {
    return <div className="h-72 rounded-2xl bg-white dark:bg-slate-800 p-5 animate-pulse" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/60 h-80 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-slate-400 font-medium">No category expense data available yet.</p>
        <span className="text-xs text-gray-400 dark:text-slate-500 mt-1">Add your first expense transaction to view category analytics.</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Expense by Category</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value, currency), 'Amount']}
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{value}</span>}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
