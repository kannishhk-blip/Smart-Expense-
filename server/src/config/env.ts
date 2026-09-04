import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'smart_expense_tracker_secret_key_2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
