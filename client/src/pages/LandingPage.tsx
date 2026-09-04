import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                SmartExpense
              </span>
              <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                Budget Tracker
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Financial Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Take control of your{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              money.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Track your income, manage expenses, set budgets, and understand your spending with simple and powerful financial insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base hover:from-emerald-400 hover:to-teal-400 transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-base hover:bg-slate-800 transition-all text-center"
            >
              Demo Account Login
            </Link>
          </div>

          <div className="mt-8 text-xs text-slate-500">
            Tagline: “Track your money. Understand your spending. Reach your goals.”
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold">Everything you need to master personal finance</h2>
            <p className="mt-3 text-slate-400 text-sm">
              Designed for college students, working professionals, freelancers, and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Income & Expense Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Categorize daily transactions seamlessly with custom payment methods, search, filtering, and notes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly Budget Alerts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Set category budgets and receive real-time warnings when reaching 80% or exceeding your set limits.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Interactive Recharts pie charts, monthly comparison trends, MoM spending shifts, and CSV exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold">How It Works</h2>
            <p className="mt-2 text-slate-400 text-sm">3 simple steps to financial clarity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-lg mb-2">Add Income & Expenses</h4>
              <p className="text-xs text-slate-400">Log daily expenses like food, travel, shopping, or monthly salary.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-lg mb-2">Set Budgets & Goals</h4>
              <p className="text-xs text-slate-400">Control spending per category and track savings goals like a new laptop.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-lg mb-2">Analyze & Save</h4>
              <p className="text-xs text-slate-400">Review monthly reports, identify overspending, and grow your savings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Smart Expense & Budget Tracker. Full-Stack Academic & Production Project.</p>
      </footer>
    </div>
  );
};
