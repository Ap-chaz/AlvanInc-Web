import { Router } from 'express';
import health from './health.js';
import auth from './auth.js';
import enquiries from './enquiries.js';
import faq from './faq.js';
import packages from './packages.js';
import projects from './projects.js';
import content from './content.js';

// Everything here is mounted under /api (see app.js).
const router = Router();
router.use(health);
router.use(auth);
router.use(enquiries);
router.use(faq);
router.use(packages);
router.use(projects);
router.use(content);
export default router;
