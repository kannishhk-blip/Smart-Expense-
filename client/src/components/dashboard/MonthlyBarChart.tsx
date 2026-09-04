import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyTrend } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface MonthlyBarChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data, isLoading }) => {
  const { currency } = useCurrency();

  if (isLoading) {
    return <div className="h-72 rounded-2xl bg-white dark:bg-slate-800 p-5 animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Income vs Expenses</h3>
        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Monthly Comparison</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="month" tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value, currency), '']}
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs font-medium text-gray-600 dark:text-slate-300 capitalize">{value}</span>}
            />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
