import {
  createTransactionSchema,
  createBudgetSchema,
  createSavingsGoalSchema,
  registerSchema,
  loginSchema,
} from '../validators/schemas';

export function runValidationTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  test('Transaction Schema: Accepts valid transaction payload', () => {
    const valid = {
      type: 'EXPENSE',
      amount: 450.5,
      category: 'Food',
      description: 'Dinner with friends',
      paymentMethod: 'UPI',
    };
    const parsed = createTransactionSchema.safeParse(valid);
    if (!parsed.success) throw new Error(`Expected success, got: ${JSON.stringify(parsed.error.errors)}`);
  });

  test('Transaction Schema: Rejects negative or zero amount', () => {
    const invalidZero = {
      type: 'EXPENSE',
      amount: 0,
      category: 'Food',
      description: 'Dinner',
    };
    const parsedZero = createTransactionSchema.safeParse(invalidZero);
    if (parsedZero.success) throw new Error('Expected zero amount to fail');

    const invalidNeg = {
      type: 'EXPENSE',
      amount: -100,
      category: 'Food',
      description: 'Dinner',
    };
    const parsedNeg = createTransactionSchema.safeParse(invalidNeg);
    if (parsedNeg.success) throw new Error('Expected negative amount to fail');
  });

  test('Transaction Schema: Rejects invalid transaction type', () => {
    const invalidType = {
      type: 'TRANSFER',
      amount: 200,
      category: 'Food',
      description: 'Test',
    };
    const parsed = createTransactionSchema.safeParse(invalidType);
    if (parsed.success) throw new Error('Expected invalid transaction type to fail');
  });

  test('Budget Schema: Rejects non-positive budget limits', () => {
    const invalid = {
      category: 'Food',
      amount: -500,
    };
    const parsed = createBudgetSchema.safeParse(invalid);
    if (parsed.success) throw new Error('Expected negative budget limit to fail');
  });

  test('Registration Schema: Rejects mismatched password confirmation', () => {
    const invalid = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'PasswordXYZ',
    };
    const parsed = registerSchema.safeParse(invalid);
    if (parsed.success) throw new Error('Expected password mismatch to fail');
  });

  test('Registration Schema: Rejects invalid email format', () => {
    const invalid = {
      name: 'John Doe',
      email: 'invalid-email-string',
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    const parsed = registerSchema.safeParse(invalid);
    if (parsed.success) throw new Error('Expected malformed email to fail');
  });

  test('Login Schema: Accepts valid email and password format', () => {
    const valid = {
      email: 'demo@example.com',
      password: 'Demo@12345',
    };
    const parsed = loginSchema.safeParse(valid);
    if (!parsed.success) throw new Error('Expected valid login format to pass');
  });

  return results;
}
