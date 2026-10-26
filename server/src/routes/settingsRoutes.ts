import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { updateSettingsSchema } from '../validators/schemas';

const router = Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', validateBody(updateSettingsSchema), updateSettings);

export default router;
