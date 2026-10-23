import { Router } from 'express';
import * as packages from '../controllers/packages.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.get('/packages', packages.list);
router.post('/admin/packages', requireAdmin, packages.create);
router.put('/admin/packages/:id', requireAdmin, packages.update);
router.delete('/admin/packages/:id', requireAdmin, packages.remove);
export default router;
