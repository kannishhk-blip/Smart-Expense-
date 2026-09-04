import { Router } from 'express';
import { getMonthlyReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/monthly', getMonthlyReport);

export default router;
