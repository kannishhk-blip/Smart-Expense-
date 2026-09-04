import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, ensureDbSchema } from '../config/db';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/authMiddleware';

// Helper to seed demo user on demand if missing
async function seedDemoUserIfMissing() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
    if (existing) return existing;

    console.log('🌱 Auto-seeding Demo User (demo@example.com)...');
    const passwordHash = await bcrypt.hash('Demo@12345', 10);

    const demoUser = await prisma.user.create({
      data: {
        name: 'Alex Johnson',
        email: 'demo@example.com',
        passwordHash,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        settings: {
          create: {
            currency: 'INR',
            darkMode: false,
            notificationsEnabled: true,
            budgetAlertsEnabled: true,
            monthlyReportsEnabled: true,
          },
        },
      },
      include: { settings: true },
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Create Monthly Budgets
    await prisma.budget.createMany({
      data: [
        { userId: demoUser.id, category: 'Food', amount: 4000, month: currentMonth, year: currentYear },
        { userId: demoUser.id, category: 'Travel', amount: 2500, month: currentMonth, year: currentYear },
        { userId: demoUser.id, category: 'Shopping', amount: 3000, month: currentMonth, year: currentYear },
        { userId: demoUser.id, category: 'Entertainment', amount: 1500, month: currentMonth, year: currentYear },
        { userId: demoUser.id, category: 'Bills', amount: 3500, month: currentMonth, year: currentYear },
      ],
    });

    // Create Savings Goals
    await prisma.savingsGoal.createMany({
      data: [
        {
          userId: demoUser.id,
          name: 'New Laptop',
          targetAmount: 60000,
          currentAmount: 25000,
          targetDate: new Date(currentYear, currentMonth + 3, 15),
          description: 'M3 MacBook Air for work & development',
          status: 'IN_PROGRESS',
        },
        {
          userId: demoUser.id,
          name: 'Emergency Fund',
          targetAmount: 30000,
          currentAmount: 30000,
          targetDate: new Date(currentYear, currentMonth - 1, 1),
          description: '3 months liquid reserve',
          status: 'COMPLETED',
        },
      ],
    });

    // Create Sample Transactions
    const sampleTransactions = [
      { type: 'INCOME', amount: 35000, category: 'Salary', description: 'Monthly Tech Salary', paymentMethod: 'Bank Transfer', daysAgo: 2, notes: 'Direct deposit' },
      { type: 'INCOME', amount: 5000, category: 'Freelance', description: 'UI Design Client Project', paymentMethod: 'UPI', daysAgo: 10, notes: 'Figma mockups delivery' },
      { type: 'EXPENSE', amount: 3200, category: 'Food', description: 'Grocery shopping at DMart', paymentMethod: 'UPI', daysAgo: 3, notes: 'Weekly household supplies' },
      { type: 'EXPENSE', amount: 850, category: 'Food', description: 'Lunch with college friends', paymentMethod: 'Cash', daysAgo: 1 },
      { type: 'EXPENSE', amount: 1800, category: 'Travel', description: 'Monthly Metro & Cab pass', paymentMethod: 'Debit Card', daysAgo: 5 },
      { type: 'EXPENSE', amount: 2500, category: 'Shopping', description: 'Winter jacket on Myntra', paymentMethod: 'Credit Card', daysAgo: 8 },
      { type: 'EXPENSE', amount: 1500, category: 'Education', description: 'Udemy Full Stack Course', paymentMethod: 'UPI', daysAgo: 12 },
      { type: 'EXPENSE', amount: 2000, category: 'Bills', description: 'Electricity & Wifi bill', paymentMethod: 'Bank Transfer', daysAgo: 7 },
      { type: 'EXPENSE', amount: 1200, category: 'Entertainment', description: 'Movie tickets & snacks', paymentMethod: 'UPI', daysAgo: 4 },
      { type: 'INCOME', amount: 35000, category: 'Salary', description: 'Monthly Tech Salary', paymentMethod: 'Bank Transfer', daysAgo: 32 },
      { type: 'EXPENSE', amount: 3800, category: 'Food', description: 'Monthly Grocery & Swiggy', paymentMethod: 'UPI', daysAgo: 35 },
      { type: 'EXPENSE', amount: 2100, category: 'Travel', description: 'Uber rides & Auto', paymentMethod: 'UPI', daysAgo: 40 },
    ];

    for (const tx of sampleTransactions) {
      const txDate = new Date();
      txDate.setDate(txDate.getDate() - tx.daysAgo);
      await prisma.transaction.create({
        data: {
          userId: demoUser.id,
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          description: tx.description,
          paymentMethod: tx.paymentMethod,
          transactionDate: txDate,
          notes: tx.notes || null,
        },
      });
    }

    // Create Sample Notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: demoUser.id,
          type: 'BUDGET_WARNING',
          message: 'You have used 80% of your Food budget.',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          userId: demoUser.id,
          type: 'INFO',
          message: 'Salary of ₹35,000 credited to your account.',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000 * 2),
        },
      ],
    });

    console.log('✅ Demo User seeded successfully!');
    return demoUser;
  } catch (err) {
    console.error('Failed to auto-seed demo user:', err);
    return null;
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('does not exist')) {
        ensureDbSchema();
        existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      } else {
        throw dbErr;
      }
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash,
        settings: {
          create: {
            currency: 'INR',
            darkMode: false,
            notificationsEnabled: true,
            budgetAlertsEnabled: true,
            monthlyReportsEnabled: true,
          },
        },
      },
      include: { settings: true },
    });

    const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        settings: user.settings,
      },
    });
  } catch (error: any) {
    console.error('SERVER REGISTRATION ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || "We couldn't complete registration. Please try again.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const lowerEmail = email.toLowerCase();

    // Auto-seed demo account on demand if user tries demo email
    if (lowerEmail === 'demo@example.com') {
      await seedDemoUserIfMissing();
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: lowerEmail },
        include: { settings: true },
      });
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('does not exist')) {
        ensureDbSchema();
        if (lowerEmail === 'demo@example.com') {
          await seedDemoUserIfMissing();
        }
        user = await prisma.user.findUnique({
          where: { email: lowerEmail },
          include: { settings: true },
        });
      } else {
        throw dbErr;
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        settings: user.settings,
      },
    });
  } catch (error: any) {
    console.error('SERVER LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || "We couldn't log you in. Please try again.",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        settings: user.settings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile data.' });
  }
};
