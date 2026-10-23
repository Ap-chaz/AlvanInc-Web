import rateLimit from 'express-rate-limit';
import { clientKey } from '../lib/clientKey.js';

// 5 enquiries per hour per visitor.
export const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
});

// 10 login attempts per 15 minutes per visitor.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
});
