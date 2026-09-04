import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const incomeAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'INCOME' },
    });

    const expenseAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'EXPENSE' },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpenses = expenseAgg._sum.amount || 0;
    const balance = totalIncome - totalExpenses;
    const savings = balance;
    const savingsRate = totalIncome > 0 ? parseFloat(((savings / totalIncome) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        savings,
        savingsRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load dashboard summary.' });
  }
};

export const getCategoryBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { period } = req.query; // 'month', 'year', 'all'

    const now = new Date();
    let whereDate: any = {};
    if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      whereDate = { gte: startOfMonth };
    } else if (period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      whereDate = { gte: startOfYear };
    }

    const categoryGroups = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        type: 'EXPENSE',
        ...(Object.keys(whereDate).length && { transactionDate: whereDate }),
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalExpenseSum = categoryGroups.reduce((acc, curr) => acc + (curr._sum.amount || 0), 0);

    const breakdown = categoryGroups
      .map((item) => ({
        category: item.category,
        amount: item._sum.amount || 0,
        count: item._count.id,
        percentage: totalExpenseSum > 0 ? parseFloat((((item._sum.amount || 0) / totalExpenseSum) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      totalExpenseSum,
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category breakdown.' });
  }
};

export const getMonthlyTrends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const currentYear = now.getFullYear();

    // Fetch transactions for the current year
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: { gte: startOfYear, lte: endOfYear },
      },
      select: {
        type: true,
        amount: true,
        transactionDate: true,
      },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<number, { income: number; expense: number }>();

    for (let i = 0; i < 12; i++) {
      monthlyMap.set(i, { income: 0, expense: 0 });
    }

    transactions.forEach((t) => {
      const m = new Date(t.transactionDate).getMonth();
      const curr = monthlyMap.get(m)!;
      if (t.type === 'INCOME') {
        curr.income += t.amount;
      } else {
        curr.expense += t.amount;
      }
    });

    const trends = monthNames.map((name, index) => {
      const data = monthlyMap.get(index)!;
      return {
        month: name,
        monthIndex: index + 1,
        income: data.income,
        expense: data.expense,
        savings: data.income - data.expense,
      };
    });

    res.json({
      success: true,
      year: currentYear,
      trends,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load monthly trends.' });
  }
};

export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Current month expenses
    const currMonthExpAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { userId, type: 'EXPENSE', transactionDate: { gte: currentMonthStart } },
    });

    // Prev month expenses
    const prevMonthExpAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'EXPENSE', transactionDate: { gte: prevMonthStart, lte: prevMonthEnd } },
    });

    const currExpense = currMonthExpAgg._sum.amount || 0;
    const prevExpense = prevMonthExpAgg._sum.amount || 0;

    let momComparisonMessage = 'Insufficient historical data for month-over-month comparison.';
    if (prevExpense > 0 && currExpense > 0) {
      const pctChange = Math.round(((currExpense - prevExpense) / prevExpense) * 100);
      if (pctChange > 0) {
        momComparisonMessage = `Your expenses increased by ${pctChange}% compared with last month.`;
      } else if (pctChange < 0) {
        momComparisonMessage = `Great job! Your expenses decreased by ${Math.abs(pctChange)}% compared with last month.`;
      } else {
        momComparisonMessage = `Your monthly spending is identical to last month.`;
      }
    }

    // Top spending category
    const topCategoryGroup = await prisma.transaction.groupBy({
      by: ['category'],
      where: { userId, type: 'EXPENSE' },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    });

    const topCategory = topCategoryGroup.length > 0 ? { category: topCategoryGroup[0].category, amount: topCategoryGroup[0]._sum.amount || 0 } : null;

    // Highest single expense transaction
    const highestExpenseTx = await prisma.transaction.findFirst({
      where: { userId, type: 'EXPENSE' },
      orderBy: { amount: 'desc' },
    });

    // Average daily spending (over the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const thirtyDayAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'EXPENSE', transactionDate: { gte: thirtyDaysAgo } },
    });

    const avgDailySpending = Math.round((thirtyDayAgg._sum.amount || 0) / 30);

    // Total income vs expense for savings rate
    const incAgg = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: 'INCOME' } });
    const expAgg = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { userId, type: 'EXPENSE' } });
    const totInc = incAgg._sum.amount || 0;
    const totExp = expAgg._sum.amount || 0;
    const savingsRate = totInc > 0 ? parseFloat((((totInc - totExp) / totInc) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      insights: {
        topSpendingCategory: topCategory,
        highestExpense: highestExpenseTx ? { description: highestExpenseTx.description, amount: highestExpenseTx.amount, category: highestExpenseTx.category, date: highestExpenseTx.transactionDate } : null,
        averageDailySpending: avgDailySpending,
        monthlySavingsRate: savingsRate,
        momComparisonMessage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate financial insights.' });
  }
};
