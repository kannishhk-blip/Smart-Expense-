import { Router } from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getInsights,
} from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/insights', getInsights);

export default router;
