import { Router } from 'express';
import * as faq from '../controllers/faq.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.get('/faq', faq.list);

router.post('/admin/faq/groups', requireAdmin, faq.createGroup);
router.put('/admin/faq/groups/:id', requireAdmin, faq.updateGroup);
router.delete('/admin/faq/groups/:id', requireAdmin, faq.removeGroup);

router.post('/admin/faq/items', requireAdmin, faq.createItem);
router.put('/admin/faq/items/:id', requireAdmin, faq.updateItem);
router.delete('/admin/faq/items/:id', requireAdmin, faq.removeItem);
export default router;
