import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
        <Wallet className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-gray-900 dark:text-white">404</h1>
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
