import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportCSV,
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { createTransactionSchema, updateTransactionSchema } from '../validators/schemas';

const router = Router();

router.use(authenticateToken);

router.get('/', getTransactions);
router.get('/export', exportCSV);
router.post('/', validateBody(createTransactionSchema), createTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', validateBody(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
