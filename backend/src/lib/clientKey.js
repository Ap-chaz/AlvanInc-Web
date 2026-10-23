import { ipKeyGenerator } from 'express-rate-limit';

// Behind Vercel, x-vercel-forwarded-for holds the real visitor address and can't be faked by the visitor.
export const clientKey = (req) => ipKeyGenerator(req.headers['x-vercel-forwarded-for'] ?? req.ip);
