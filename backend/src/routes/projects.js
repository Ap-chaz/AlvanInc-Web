import { Router } from 'express';
import * as projects from '../controllers/projects.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.get('/projects', projects.list);
router.get('/projects/:slug', projects.getBySlug);
router.post('/admin/projects', requireAdmin, projects.create);
router.put('/admin/projects/:id', requireAdmin, projects.update);
router.delete('/admin/projects/:id', requireAdmin, projects.remove);
export default router;
