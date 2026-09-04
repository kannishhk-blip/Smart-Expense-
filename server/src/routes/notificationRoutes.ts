import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/', clearNotifications);

export default router;
