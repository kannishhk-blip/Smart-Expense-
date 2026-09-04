import { Router } from 'express';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addFundsToGoal,
  deleteSavingsGoal,
} from '../controllers/savingsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSavingsGoals);
router.post('/', createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.post('/:id/add-funds', addFundsToGoal);
router.delete('/:id', deleteSavingsGoal);

export default router;
