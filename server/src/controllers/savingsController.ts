import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getSavingsGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const goalsWithProgress = goals.map((g) => {
      const progress = g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
      return {
        ...g,
        progress: parseFloat(progress.toFixed(1)),
      };
    });

    res.json({ success: true, goals: goalsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve savings goals.' });
  }
};

export const createSavingsGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, targetAmount, currentAmount = 0, targetDate, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Goal name is required.' });
    }

    const targetNum = parseFloat(targetAmount);
    if (isNaN(targetNum) || targetNum <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid target amount greater than zero.' });
    }

    const currentNum = parseFloat(currentAmount) || 0;
    const tDate = targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const status = currentNum >= targetNum ? 'COMPLETED' : 'IN_PROGRESS';

    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        name: name.trim(),
        targetAmount: targetNum,
        currentAmount: currentNum,
        targetDate: tDate,
        description: description ? description.trim() : null,
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully.',
      goal: {
        ...goal,
        progress: targetNum > 0 ? Math.min(100, parseFloat(((currentNum / targetNum) * 100).toFixed(1))) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't save that savings goal. Please try again." });
  }
};

export const updateSavingsGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, targetAmount, currentAmount, targetDate, description, status } = req.body;

    const existing = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    const targetNum = targetAmount !== undefined ? parseFloat(targetAmount) : existing.targetAmount;
    const currentNum = currentAmount !== undefined ? parseFloat(currentAmount) : existing.currentAmount;
    const updatedStatus = status || (currentNum >= targetNum ? 'COMPLETED' : 'IN_PROGRESS');

    const updated = await prisma.savingsGoal.update({
      where: { id },
      data: {
        name: name || existing.name,
        targetAmount: targetNum,
        currentAmount: currentNum,
        targetDate: targetDate ? new Date(targetDate) : existing.targetDate,
        description: description !== undefined ? description : existing.description,
        status: updatedStatus,
      },
    });

    res.json({
      success: true,
      message: 'Savings goal updated successfully.',
      goal: {
        ...updated,
        progress: targetNum > 0 ? Math.min(100, parseFloat(((currentNum / targetNum) * 100).toFixed(1))) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't update the savings goal. Please try again." });
  }
};

export const addFundsToGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { amount } = req.body;

    const addNum = parseFloat(amount);
    if (isNaN(addNum) || addNum <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid deposit amount greater than zero.' });
    }

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    const newCurrentAmount = goal.currentAmount + addNum;
    const isCompletedNow = newCurrentAmount >= goal.targetAmount;
    const status = isCompletedNow ? 'COMPLETED' : 'IN_PROGRESS';

    const updated = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: newCurrentAmount,
        status,
      },
    });

    if (isCompletedNow && goal.status !== 'COMPLETED') {
      await prisma.notification.create({
        data: {
          userId,
          type: 'GOAL_ACHIEVED',
          message: `Congratulations! You reached your savings goal: "${goal.name}" (₹${goal.targetAmount.toLocaleString('en-IN')})!`,
        },
      });
    }

    res.json({
      success: true,
      message: isCompletedNow ? `Goal "${goal.name}" completed!` : `₹${addNum} added to "${goal.name}".`,
      goal: {
        ...updated,
        progress: updated.targetAmount > 0 ? Math.min(100, parseFloat(((updated.currentAmount / updated.targetAmount) * 100).toFixed(1))) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add money to savings goal.' });
  }
};

export const deleteSavingsGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Savings goal not found.' });
    }

    await prisma.savingsGoal.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Savings goal deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't delete the savings goal. Please try again." });
  }
};
