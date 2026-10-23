import { Router } from 'express';
import { create, list, updateStatus, remove } from '../controllers/enquiries.js';
import { enquiryLimiter } from '../middleware/rateLimits.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.post('/enquiries', enquiryLimiter, create);
router.get('/enquiries', requireAdmin, list);
router.put('/admin/enquiries/:id/status', requireAdmin, updateStatus);
router.delete('/admin/enquiries/:id', requireAdmin, remove);
export default router;
