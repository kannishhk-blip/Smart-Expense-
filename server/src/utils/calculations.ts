export interface BudgetAlertEvaluation {
  status: 'NORMAL' | 'WARNING' | 'EXCEEDED';
  percentageUsed: number;
  overspentAmount: number;
  message: string | null;
}

/**
 * Pure function to calculate budget utilization and alert status
 */
export function evaluateBudgetStatus(
  budgetAmount: number,
  totalSpent: number,
  category: string
): BudgetAlertEvaluation {
  if (budgetAmount <= 0) {
    return {
      status: 'NORMAL',
      percentageUsed: 0,
      overspentAmount: 0,
      message: null,
    };
  }

  const percentageUsed = Math.round((totalSpent / budgetAmount) * 100);

  if (totalSpent > budgetAmount) {
    const overspentAmount = Math.round(totalSpent - budgetAmount);
    return {
      status: 'EXCEEDED',
      percentageUsed,
      overspentAmount,
      message: `You have exceeded your ${category} budget by ₹${overspentAmount.toLocaleString('en-IN')}.`,
    };
  }

  if (percentageUsed >= 80) {
    return {
      status: 'WARNING',
      percentageUsed,
      overspentAmount: 0,
      message: `You have used ${percentageUsed}% of your ${category} budget.`,
    };
  }

  return {
    status: 'NORMAL',
    percentageUsed,
    overspentAmount: 0,
    message: null,
  };
}

/**
 * Calculates net savings rate percentage with zero-division safeguard
 */
export function calculateSavingsRate(totalIncome: number, totalExpenses: number): number {
  if (totalIncome <= 0) return 0;
  const netSavings = totalIncome - totalExpenses;
  const rate = (netSavings / totalIncome) * 100;
  return parseFloat(rate.toFixed(1));
}

/**
 * Calculates Month-over-Month (MoM) expense variation percentage and natural explanation
 */
export function calculateMonthOverMonthShift(
  currentMonthExpenses: number,
  previousMonthExpenses: number
): { percentageChange: number | null; message: string } {
  if (previousMonthExpenses <= 0 || currentMonthExpenses <= 0) {
    return {
      percentageChange: null,
      message: 'Insufficient historical data for month-over-month comparison.',
    };
  }

  const shift = Math.round(((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100);

  if (shift > 0) {
    return {
      percentageChange: shift,
      message: `Your expenses increased by ${shift}% compared with last month.`,
    };
  } else if (shift < 0) {
    return {
      percentageChange: shift,
      message: `Great job! Your expenses decreased by ${Math.abs(shift)}% compared with last month.`,
    };
  }

  return {
    percentageChange: 0,
    message: 'Your monthly spending is identical to last month.',
  };
}

/**
 * Calculates daily average spending over rolling window
 */
export function calculateAverageDailySpending(totalExpenses: number, days: number = 30): number {
  if (days <= 0 || totalExpenses <= 0) return 0;
  return Math.round(totalExpenses / days);
}
