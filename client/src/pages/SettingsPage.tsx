import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { apiRequest } from '../services/api';
import { Bell, Moon, Sun, DollarSign, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currency, setCurrency } = useCurrency();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(true);
  const [monthlyReportsEnabled, setMonthlyReportsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setNotificationsEnabled(user.settings.notificationsEnabled);
      setBudgetAlertsEnabled(user.settings.budgetAlertsEnabled);
      setMonthlyReportsEnabled(user.settings.monthlyReportsEnabled);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await apiRequest('/settings', 'PUT', {
        currency,
        darkMode: isDarkMode,
        notificationsEnabled,
        budgetAlertsEnabled,
        monthlyReportsEnabled,
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Customize currency defaults, appearance themes, and notification triggers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Appearance & Theme</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Switch between dark mode and light mode interface</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50">
            <div>
              <span className="font-semibold text-sm text-gray-900 dark:text-white block">Dark Theme Mode</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">Optimized dark contrast for night use</span>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isDarkMode ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Currency Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Default Currency</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Set primary currency display (Default: INR ₹)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { code: 'INR', label: 'Indian Rupee (₹)' },
              { code: 'USD', label: 'US Dollar ($)' },
              { code: 'EUR', label: 'Euro (€)' },
              { code: 'GBP', label: 'British Pound (£)' },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                  currency === c.code
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
                }`}
              >
                <span>{c.label}</span>
                {currency === c.code && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Notifications Preferences</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Choose which alerts you want to receive</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900/50">
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white block">In-App Notifications</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Enable system notification popover</span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notificationsEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900/50">
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white block">Budget Overspending Alerts</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Receive warnings at 80% and 100% budget limit</span>
              </div>
              <button
                type="button"
                onClick={() => setBudgetAlertsEnabled(!budgetAlertsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  budgetAlertsEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900/50">
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white block">Monthly Report Alerts</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Notify when monthly financial summary is ready</span>
              </div>
              <button
                type="button"
                onClick={() => setMonthlyReportsEnabled(!monthlyReportsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  monthlyReportsEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-extrabold text-sm text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            {isSaving ? 'Saving Preferences...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
