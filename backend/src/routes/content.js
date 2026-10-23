import { Router } from 'express';
import { listServices, listProcess, listCategories } from '../controllers/content.js';
import { adminCrud } from '../lib/adminCrud.js';
import { requestRebuild } from '../lib/rebuild.js';

const router = Router();

router.get('/services', listServices);
router.get('/process', listProcess);
router.get('/categories', listCategories);

// Create / edit / delete for each simple list.
adminCrud(router, 'services', 'services', { name: 100, tier: 60, body: 5000 }, 'service');
adminCrud(router, 'process', 'process_steps', { name: 100, duration: 60, body: 5000 }, 'process step');
// A category name is shown on project pages, so changing one also rebuilds the site.
adminCrud(router, 'categories', 'categories', { name: 100 }, 'category', requestRebuild);

export default router;
