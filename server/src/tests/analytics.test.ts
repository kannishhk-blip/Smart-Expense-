import {
  calculateSavingsRate,
  calculateMonthOverMonthShift,
  calculateAverageDailySpending,
} from '../utils/calculations';

export function runAnalyticsTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  test('Savings Rate: Positive net savings calculated accurately', () => {
    const rate = calculateSavingsRate(50000, 30000); // 20000 savings out of 50000 = 40%
    if (rate !== 40.0) throw new Error(`Expected 40.0%, got ${rate}%`);
  });

  test('Savings Rate: Zero income handled safely without division by zero', () => {
    const rate = calculateSavingsRate(0, 5000);
    if (rate !== 0) throw new Error(`Expected 0%, got ${rate}%`);
  });

  test('Savings Rate: Negative savings rate when expenses exceed income', () => {
    const rate = calculateSavingsRate(20000, 30000); // -10000 / 20000 = -50%
    if (rate !== -50.0) throw new Error(`Expected -50.0%, got ${rate}%`);
  });

  test('MoM Shift: Calculates percentage increase and natural explanation', () => {
    const res = calculateMonthOverMonthShift(15000, 10000); // +50%
    if (res.percentageChange !== 50) throw new Error(`Expected +50%, got ${res.percentageChange}`);
    if (!res.message.includes('increased by 50%')) throw new Error(`Unexpected message: ${res.message}`);
  });

  test('MoM Shift: Calculates percentage decrease and encouraging message', () => {
    const res = calculateMonthOverMonthShift(8000, 10000); // -20%
    if (res.percentageChange !== -20) throw new Error(`Expected -20%, got ${res.percentageChange}`);
    if (!res.message.includes('decreased by 20%')) throw new Error(`Unexpected message: ${res.message}`);
  });

  test('MoM Shift: Handles missing historical data gracefully', () => {
    const res = calculateMonthOverMonthShift(5000, 0);
    if (res.percentageChange !== null) throw new Error(`Expected null change, got ${res.percentageChange}`);
    if (!res.message.includes('Insufficient historical data')) throw new Error(`Unexpected message: ${res.message}`);
  });

  test('Daily Burn Rate: Divides 30-day cumulative expense accurately', () => {
    const avg = calculateAverageDailySpending(30000, 30);
    if (avg !== 1000) throw new Error(`Expected 1000/day, got ${avg}`);
  });

  return results;
}
