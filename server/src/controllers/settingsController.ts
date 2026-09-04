import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId },
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { currency, darkMode, notificationsEnabled, budgetAlertsEnabled, monthlyReportsEnabled } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        ...(currency && { currency }),
        ...(darkMode !== undefined && { darkMode }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(budgetAlertsEnabled !== undefined && { budgetAlertsEnabled }),
        ...(monthlyReportsEnabled !== undefined && { monthlyReportsEnabled }),
      },
      create: {
        userId,
        currency: currency || 'INR',
        darkMode: darkMode || false,
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
        budgetAlertsEnabled: budgetAlertsEnabled !== undefined ? budgetAlertsEnabled : true,
        monthlyReportsEnabled: monthlyReportsEnabled !== undefined ? monthlyReportsEnabled : true,
      },
    });

    res.json({
      success: true,
      message: 'Settings updated successfully.',
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't save your settings. Please try again." });
  }
};
