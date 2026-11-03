import { Router } from 'express';
import { create, list, updateStatus, remove } from '../controllers/applications.js';
import { enquiryLimiter } from '../middleware/rateLimits.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.post('/applications', enquiryLimiter, create);
router.get('/applications', requireAdmin, list);
router.put('/admin/applications/:id/status', requireAdmin, updateStatus);
router.delete('/admin/applications/:id', requireAdmin, remove);
export default router;