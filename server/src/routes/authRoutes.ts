import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../validators/schemas';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

export default router;
