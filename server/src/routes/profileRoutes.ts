import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
