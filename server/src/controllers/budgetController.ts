import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month as string, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : now.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
      orderBy: { category: 'asc' },
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenseAgg = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        type: 'EXPENSE',
        transactionDate: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const spentMap = new Map<string, number>();
    expenseAgg.forEach((item) => {
      spentMap.set(item.category, item._sum.amount || 0);
    });

    const budgetDetails = budgets.map((b) => {
      const spent = spentMap.get(b.category) || 0;
      const remaining = Math.max(0, b.amount - spent);
      const percentageUsed = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      let alertStatus = 'NORMAL';
      if (spent > b.amount) {
        alertStatus = 'EXCEEDED';
      } else if (percentageUsed >= 80) {
        alertStatus = 'WARNING';
      }

      return {
        id: b.id,
        category: b.category,
        budgetAmount: b.amount,
        amountSpent: spent,
        remainingAmount: remaining,
        percentageUsed,
        alertStatus,
        month: b.month,
        year: b.year,
      };
    });

    // Overall summary metrics
    const totalBudget = budgetDetails.reduce((acc, curr) => acc + curr.budgetAmount, 0);
    const totalSpent = budgetDetails.reduce((acc, curr) => acc + curr.amountSpent, 0);

    res.json({
      success: true,
      month,
      year,
      totalBudget,
      totalSpent,
      budgets: budgetDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch budget details.' });
  }
};

export const upsertBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { category, amount, month, year } = req.body;

    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Please select a category.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid positive budget amount.' });
    }

    const now = new Date();
    const budgetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const budgetYear = year ? parseInt(year, 10) : now.getFullYear();

    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId,
          category: category.trim(),
          month: budgetMonth,
          year: budgetYear,
        },
      },
      update: { amount: numericAmount },
      create: {
        userId,
        category: category.trim(),
        amount: numericAmount,
        month: budgetMonth,
        year: budgetYear,
      },
    });

    res.status(200).json({
      success: true,
      message: `Budget for ${category} saved successfully.`,
      budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't save that budget. Please try again." });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Budget record not found.' });
    }

    await prisma.budget.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Budget deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't delete the budget. Please try again." });
  }
};
