import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../db.js';

// Compared against when the email is unknown, so a wrong email and a wrong password take the same time.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function login(req, res) {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  try {
    const [rows] = await pool.execute(
      'SELECT id, password_hash FROM admin_users WHERE email = ?', [email]
    );
    const user = rows[0];
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !ok) return res.status(401).json({ ok: false, error: 'Invalid email or password' });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.cookie('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Login failed:', err.code);
    res.status(500).json({ ok: false, error: 'Login failed' });
  }
}

export function logout(req, res) {
  res.clearCookie('admin_token');
  res.json({ ok: true });
}

// Lets the dashboard ask "is this cookie still valid?" before it renders anything private.
export function me(req, res) {
  res.json({ ok: true, id: req.adminId });
}
