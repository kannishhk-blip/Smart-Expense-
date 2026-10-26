import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters long').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(128, 'Password is too long'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const transactionCategoryEnum = z.enum([
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Rent',
  'Subscriptions',
  'Salary',
  'Freelance',
  'Business',
  'Allowance',
  'Investment',
  'Other',
]);

export const paymentMethodEnum = z.enum([
  'Cash',
  'UPI',
  'Debit Card',
  'Credit Card',
  'Bank Transfer',
  'Other',
]);

export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Transaction type must be either INCOME or EXPENSE' }),
  }),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  category: z.string().trim().min(1, 'Please select a valid category'),
  description: z.string().trim().min(1, 'Description is required').max(200, 'Description must not exceed 200 characters'),
  paymentMethod: z.string().trim().default('Cash'),
  transactionDate: z.string().or(z.date()).optional(),
  notes: z.string().trim().max(500, 'Notes must not exceed 500 characters').nullable().optional(),
  receiptUrl: z.string().url('Invalid receipt URL format').nullable().optional().or(z.literal('')),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const createBudgetSchema = z.object({
  category: z.string().trim().min(1, 'Please select a category'),
  amount: z.coerce.number().positive('Budget amount must be a positive number'),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
});

export const createSavingsGoalSchema = z.object({
  name: z.string().trim().min(2, 'Goal name must be at least 2 characters').max(100, 'Goal name is too long'),
  targetAmount: z.coerce.number().positive('Target amount must be greater than zero'),
  currentAmount: z.coerce.number().min(0, 'Current amount cannot be negative').default(0),
  targetDate: z.string().or(z.date()).optional(),
  description: z.string().trim().max(500, 'Description is too long').nullable().optional(),
});

export const addFundsSchema = z.object({
  amount: z.coerce.number().positive('Deposit amount must be greater than zero'),
});

export const updateSettingsSchema = z.object({
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
  darkMode: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  budgetAlertsEnabled: z.boolean().optional(),
  monthlyReportsEnabled: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  profileImage: z.string().url('Invalid profile image URL').optional().or(z.literal('')),
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
});
