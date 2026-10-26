import { Router } from 'express';
import { getBudgets, upsertBudget, deleteBudget } from '../controllers/budgetController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { createBudgetSchema } from '../validators/schemas';

const router = Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', validateBody(createBudgetSchema), upsertBudget);
router.delete('/:id', deleteBudget);

export default router;
