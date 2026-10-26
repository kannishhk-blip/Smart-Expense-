import { evaluateBudgetStatus } from '../utils/calculations';

export function runBudgetAlertTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  test('Normal budget utilization (< 80%) returns NORMAL status and no alert', () => {
    const res = evaluateBudgetStatus(1000, 500, 'Food');
    if (res.status !== 'NORMAL') throw new Error(`Expected NORMAL, got ${res.status}`);
    if (res.percentageUsed !== 50) throw new Error(`Expected 50%, got ${res.percentageUsed}`);
    if (res.message !== null) throw new Error(`Expected null message, got ${res.message}`);
  });

  test('Boundary: Exactly 80% utilization returns WARNING status', () => {
    const res = evaluateBudgetStatus(1000, 800, 'Travel');
    if (res.status !== 'WARNING') throw new Error(`Expected WARNING, got ${res.status}`);
    if (res.percentageUsed !== 80) throw new Error(`Expected 80%, got ${res.percentageUsed}`);
    if (!res.message?.includes('80% of your Travel budget')) {
      throw new Error(`Unexpected message: ${res.message}`);
    }
  });

  test('Warning zone (85% utilization) returns WARNING status with formatted percent', () => {
    const res = evaluateBudgetStatus(2000, 1700, 'Shopping');
    if (res.status !== 'WARNING') throw new Error(`Expected WARNING, got ${res.status}`);
    if (res.percentageUsed !== 85) throw new Error(`Expected 85%, got ${res.percentageUsed}`);
    if (!res.message?.includes('85% of your Shopping budget')) {
      throw new Error(`Unexpected message: ${res.message}`);
    }
  });

  test('Boundary: Exactly 100% utilization returns WARNING (not exceeded)', () => {
    const res = evaluateBudgetStatus(1000, 1000, 'Bills');
    if (res.status !== 'WARNING') throw new Error(`Expected WARNING at 100%, got ${res.status}`);
    if (res.percentageUsed !== 100) throw new Error(`Expected 100%, got ${res.percentageUsed}`);
  });

  test('Exceeded budget (> 100%) returns EXCEEDED status with exact overspent amount', () => {
    const res = evaluateBudgetStatus(5000, 5750, 'Food');
    if (res.status !== 'EXCEEDED') throw new Error(`Expected EXCEEDED, got ${res.status}`);
    if (res.overspentAmount !== 750) throw new Error(`Expected 750 overspent, got ${res.overspentAmount}`);
    if (!res.message?.includes('exceeded your Food budget by ₹750')) {
      throw new Error(`Unexpected message: ${res.message}`);
    }
  });

  test('Zero or negative budget amount handles safely without NaN', () => {
    const res = evaluateBudgetStatus(0, 500, 'Entertainment');
    if (res.status !== 'NORMAL') throw new Error(`Expected NORMAL for 0 budget, got ${res.status}`);
    if (res.percentageUsed !== 0) throw new Error(`Expected 0%, got ${res.percentageUsed}`);
  });

  return results;
}
