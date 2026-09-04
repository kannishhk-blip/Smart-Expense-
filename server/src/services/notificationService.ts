import { prisma } from '../config/db';

export const checkAndTriggerBudgetAlerts = async (userId: string, category: string, date: Date) => {
  try {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Check user settings for alerts enabled
    const settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (settings && !settings.budgetAlertsEnabled) return;

    // Find monthly budget for this category
    const budget = await prisma.budget.findFirst({
      where: { userId, category, month, year },
    });

    if (!budget || budget.amount <= 0) return;

    // Calculate total expense for this category & month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenseAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'EXPENSE',
        category,
        transactionDate: { gte: startDate, lte: endDate },
      },
    });

    const totalSpent = expenseAgg._sum.amount || 0;
    const pctUsed = Math.round((totalSpent / budget.amount) * 100);

    if (totalSpent > budget.amount) {
      const overspent = Math.round(totalSpent - budget.amount);
      const msg = `You have exceeded your ${category} budget by ₹${overspent.toLocaleString('en-IN')}.`;
      
      // Avoid spamming identical notifications
      const existing = await prisma.notification.findFirst({
        where: { userId, type: 'BUDGET_EXCEEDED', message: msg, isRead: false },
      });
      if (!existing) {
        await prisma.notification.create({
          data: { userId, type: 'BUDGET_EXCEEDED', message: msg },
        });
      }
    } else if (pctUsed >= 80) {
      const msg = `You have used ${pctUsed}% of your ${category} budget.`;
      
      const existing = await prisma.notification.findFirst({
        where: { userId, type: 'BUDGET_WARNING', message: msg, isRead: false },
      });
      if (!existing) {
        await prisma.notification.create({
          data: { userId, type: 'BUDGET_WARNING', message: msg },
        });
      }
    }
  } catch (error) {
    console.error('Error triggering budget alert:', error);
  }
};
