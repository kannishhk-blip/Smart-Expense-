import { Router } from 'express';
import { getBudgets, upsertBudget, deleteBudget } from '../controllers/budgetController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', upsertBudget);
router.delete('/:id', deleteBudget);

export default router;
