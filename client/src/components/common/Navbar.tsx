import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Wallet, Sun, Moon, Bell, User as UserIcon, LogOut, Menu, X, CheckCheck, Trash2 } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { NotificationItem } from '../../types';
import toast from 'react-hot-toast';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest('/notifications');
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (error) {
      // Quiet fail for notifications fetch
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/notifications/read-all', 'PATCH');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (error) {
      toast.error('Failed to update notifications.');
    }
  };

  const handleClearNotifications = async () => {
    try {
      await apiRequest('/notifications', 'DELETE');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Notifications cleared.');
    } catch (error) {
      toast.error('Failed to clear notifications.');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                SmartExpense
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Theme Toggle, Notifications, User Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="p-1 text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={handleClearNotifications}
                      className="p-1 text-gray-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start space-x-3 text-sm ${
                          n.isRead ? 'opacity-70 bg-white dark:bg-slate-800' : 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                            n.type === 'BUDGET_EXCEEDED'
                              ? 'bg-rose-500'
                              : n.type === 'BUDGET_WARNING'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-slate-200 leading-snug">{n.message}</p>
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-slate-200 max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 py-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
