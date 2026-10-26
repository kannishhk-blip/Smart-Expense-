import { Router } from 'express';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addFundsToGoal,
  deleteSavingsGoal,
} from '../controllers/savingsController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { createSavingsGoalSchema, addFundsSchema } from '../validators/schemas';

const router = Router();

router.use(authenticateToken);

router.get('/', getSavingsGoals);
router.post('/', validateBody(createSavingsGoalSchema), createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.post('/:id/add-funds', validateBody(addFundsSchema), addFundsToGoal);
router.delete('/:id', deleteSavingsGoal);

export default router;
