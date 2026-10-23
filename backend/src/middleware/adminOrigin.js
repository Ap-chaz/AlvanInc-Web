import { allowedOrigins } from '../config.js';

// Admin requests sent from a browser must come from one of our own sites.
export function adminOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, error: 'Origin not allowed' });
  }
  next();
}
