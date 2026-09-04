import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month as string, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [incomeAgg, expenseAgg, countAgg, topCategoryGroup, budgets] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: 'INCOME', transactionDate: { gte: startDate, lte: endDate } },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: 'EXPENSE', transactionDate: { gte: startDate, lte: endDate } },
      }),
      prisma.transaction.count({
        where: { userId, transactionDate: { gte: startDate, lte: endDate } },
      }),
      prisma.transaction.groupBy({
        by: ['category'],
        where: { userId, type: 'EXPENSE', transactionDate: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
      prisma.budget.findMany({
        where: { userId, month, year },
      }),
    ]);

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpenses = expenseAgg._sum.amount || 0;
    const netSavings = totalIncome - totalExpenses;
    const transactionCount = countAgg;
    const averageExpense = transactionCount > 0 ? Math.round(totalExpenses / transactionCount) : 0;
    const highestSpendingCategory = topCategoryGroup.length > 0 ? { category: topCategoryGroup[0].category, amount: topCategoryGroup[0]._sum.amount || 0 } : null;

    // Budget performance calculations
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const budgetPerformance = {
      totalBudget,
      totalSpent: totalExpenses,
      utilizationPct: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0,
    };

    res.json({
      success: true,
      report: {
        month,
        year,
        totalIncome,
        totalExpenses,
        netSavings,
        highestSpendingCategory,
        transactionCount,
        averageExpense,
        budgetPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate monthly report.' });
  }
};
