import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { checkAndTriggerBudgetAlerts } from '../services/notificationService';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      search,
      type,
      category,
      dateRange,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'newest',
      page = 1,
      limit = 50,
    } = req.query;

    const whereClause: any = { userId };

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { description: { contains: q } },
        { category: { contains: q } },
        { paymentMethod: { contains: q } },
      ];
    }

    // Type filter
    if (type && (type === 'INCOME' || type === 'EXPENSE')) {
      whereClause.type = type;
    }

    // Category filter
    if (category && category !== 'All' && category !== 'All Categories') {
      whereClause.category = category as string;
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      whereClause.transactionDate = { gte: startOfDay, lte: endOfDay };
    } else if (dateRange === 'this_week') {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      whereClause.transactionDate = { gte: firstDayOfWeek };
    } else if (dateRange === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      whereClause.transactionDate = { gte: startOfMonth };
    } else if (dateRange === 'last_month') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      whereClause.transactionDate = { gte: startOfLastMonth, lte: endOfLastMonth };
    } else if (startDate || endDate) {
      whereClause.transactionDate = {};
      if (startDate) whereClause.transactionDate.gte = new Date(startDate as string);
      if (endDate) whereClause.transactionDate.lte = new Date(endDate as string);
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      whereClause.amount = {};
      if (minAmount) whereClause.amount.gte = parseFloat(minAmount as string);
      if (maxAmount) whereClause.amount.lte = parseFloat(maxAmount as string);
    }

    // Sorting
    let orderBy: any = { transactionDate: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { transactionDate: 'asc' };
    } else if (sortBy === 'highest_amount') {
      orderBy = { amount: 'desc' };
    } else if (sortBy === 'lowest_amount') {
      orderBy = { amount: 'asc' };
    } else if (sortBy === 'a_z') {
      orderBy = { description: 'asc' };
    } else if (sortBy === 'z_a') {
      orderBy = { description: 'desc' };
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions.' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type, amount, category, description, paymentMethod, transactionDate, notes, receiptUrl } = req.body;

    if (!type || (type !== 'INCOME' && type !== 'EXPENSE')) {
      return res.status(400).json({ success: false, message: 'Please select a valid transaction type.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid amount greater than zero.' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Please select a category.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a description.' });
    }

    const txDate = transactionDate ? new Date(transactionDate) : new Date();

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: numericAmount,
        category: category.trim(),
        description: description.trim(),
        paymentMethod: paymentMethod || 'Cash',
        transactionDate: txDate,
        notes: notes ? notes.trim() : null,
        receiptUrl: receiptUrl || null,
      },
    });

    // Check budget alert if expense
    if (type === 'EXPENSE') {
      await checkAndTriggerBudgetAlerts(userId, category, txDate);
    }

    res.status(201).json({
      success: true,
      message: `${type === 'INCOME' ? 'Income' : 'Expense'} added successfully.`,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't save that transaction. Please try again." });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve transaction details.' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { type, amount, category, description, paymentMethod, transactionDate, notes, receiptUrl } = req.body;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found or access denied.' });
    }

    const numericAmount = amount !== undefined ? parseFloat(amount) : existing.amount;
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid amount greater than zero.' });
    }

    const updatedTx = await prisma.transaction.update({
      where: { id },
      data: {
        type: type || existing.type,
        amount: numericAmount,
        category: category || existing.category,
        description: description || existing.description,
        paymentMethod: paymentMethod || existing.paymentMethod,
        transactionDate: transactionDate ? new Date(transactionDate) : existing.transactionDate,
        notes: notes !== undefined ? notes : existing.notes,
        receiptUrl: receiptUrl !== undefined ? receiptUrl : existing.receiptUrl,
      },
    });

    if (updatedTx.type === 'EXPENSE') {
      await checkAndTriggerBudgetAlerts(userId, updatedTx.category, updatedTx.transactionDate);
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully.',
      transaction: updatedTx,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't update the transaction. Please try again." });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found or access denied.' });
    }

    await prisma.transaction.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't delete the transaction. Please try again." });
  }
};

export const exportCSV = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
    });

    let csvContent = 'Date,Description,Category,Type,Amount,Payment Method,Notes\n';
    
    transactions.forEach((t) => {
      const dateStr = new Date(t.transactionDate).toISOString().split('T')[0];
      const desc = `"${t.description.replace(/"/g, '""')}"`;
      const cat = `"${t.category.replace(/"/g, '""')}"`;
      const type = t.type;
      const amount = t.amount;
      const pm = `"${t.paymentMethod.replace(/"/g, '""')}"`;
      const notes = t.notes ? `"${t.notes.replace(/"/g, '""')}"` : '""';

      csvContent += `${dateStr},${desc},${cat},${type},${amount},${pm},${notes}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="smart_expense_report_${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export CSV report.' });
  }
};
