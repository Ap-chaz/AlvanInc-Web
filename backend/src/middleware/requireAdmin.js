import jwt from 'jsonwebtoken';

// Lets a request through only if it carries a valid admin login cookie.
export function requireAdmin(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies.admin_token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.adminId = payload.sub;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Not authenticated' });
  }
}
