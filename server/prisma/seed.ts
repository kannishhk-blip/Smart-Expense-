import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing demo user if present
  const existingDemoUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (existingDemoUser) {
    await prisma.user.delete({ where: { id: existingDemoUser.id } });
  }

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
  });

  console.log('✅ Demo User created: demo@example.com / Demo@12345');

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

  // Create Savings Goal
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

  // Create Transactions across last 3 months
  const sampleTransactions = [
    // Current month income
    { type: 'INCOME', amount: 35000, category: 'Salary', description: 'Monthly Tech Salary', paymentMethod: 'Bank Transfer', daysAgo: 2, notes: 'Direct deposit' },
    { type: 'INCOME', amount: 5000, category: 'Freelance', description: 'UI Design Client Project', paymentMethod: 'UPI', daysAgo: 10, notes: 'Figma mockups delivery' },

    // Current month expenses
    { type: 'EXPENSE', amount: 3200, category: 'Food', description: 'Grocery shopping at DMart', paymentMethod: 'UPI', daysAgo: 3, notes: 'Weekly household supplies' },
    { type: 'EXPENSE', amount: 850, category: 'Food', description: 'Lunch with college friends', paymentMethod: 'Cash', daysAgo: 1 },
    { type: 'EXPENSE', amount: 1800, category: 'Travel', description: 'Monthly Metro & Cab pass', paymentMethod: 'Debit Card', daysAgo: 5 },
    { type: 'EXPENSE', amount: 2500, category: 'Shopping', description: 'Winter jacket on Myntra', paymentMethod: 'Credit Card', daysAgo: 8 },
    { type: 'EXPENSE', amount: 1500, category: 'Education', description: 'Udemy Full Stack Course', paymentMethod: 'UPI', daysAgo: 12 },
    { type: 'EXPENSE', amount: 2000, category: 'Bills', description: 'Electricity & Wifi bill', paymentMethod: 'Bank Transfer', daysAgo: 7 },
    { type: 'EXPENSE', amount: 1200, category: 'Entertainment', description: 'Movie tickets & snacks', paymentMethod: 'UPI', daysAgo: 4 },

    // Last month transactions
    { type: 'INCOME', amount: 35000, category: 'Salary', description: 'Monthly Tech Salary', paymentMethod: 'Bank Transfer', daysAgo: 32 },
    { type: 'EXPENSE', amount: 3800, category: 'Food', description: 'Monthly Grocery & Swiggy', paymentMethod: 'UPI', daysAgo: 35 },
    { type: 'EXPENSE', amount: 2100, category: 'Travel', description: 'Uber rides & Auto', paymentMethod: 'UPI', daysAgo: 40 },
    { type: 'EXPENSE', amount: 2900, category: 'Shopping', description: 'Sneakers purchase', paymentMethod: 'Credit Card', daysAgo: 38 },
    { type: 'EXPENSE', amount: 1800, category: 'Bills', description: 'Water & Electricity', paymentMethod: 'Bank Transfer', daysAgo: 42 },

    // 2 months ago transactions
    { type: 'INCOME', amount: 35000, category: 'Salary', description: 'Monthly Tech Salary', paymentMethod: 'Bank Transfer', daysAgo: 62 },
    { type: 'EXPENSE', amount: 3500, category: 'Food', description: 'Dining out & groceries', paymentMethod: 'Debit Card', daysAgo: 65 },
    { type: 'EXPENSE', amount: 1900, category: 'Travel', description: 'Bus pass & cab fare', paymentMethod: 'UPI', daysAgo: 68 },
    { type: 'EXPENSE', amount: 1400, category: 'Healthcare', description: 'Health checkup & medicines', paymentMethod: 'UPI', daysAgo: 70 },
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

  // Create Notifications
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

  console.log('✅ Demo database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
