import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { updateProfileSchema } from '../validators/schemas';

const router = Router();

router.use(authenticateToken);

router.get('/', getProfile);
router.put('/', validateBody(updateProfileSchema), updateProfile);

export default router;
