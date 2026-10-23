import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.js';
import { loginLimiter } from '../middleware/rateLimits.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.post('/admin/login', loginLimiter, login);
router.post('/admin/logout', logout);
router.get('/admin/me', requireAdmin, me);
export default router;
