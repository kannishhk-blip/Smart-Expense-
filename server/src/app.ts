import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import savingsRoutes from './routes/savingsRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import reportRoutes from './routes/reportRoutes';
import notificationRoutes from './routes/notificationRoutes';
import profileRoutes from './routes/profileRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings-goals', savingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Smart Expense Tracker Server running on port ${ENV.PORT}`);
  });
}

export default app;
