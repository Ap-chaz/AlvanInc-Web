import { pool } from '../../db.js';
import { toId } from '../lib/validate.js';

// Same rule as enquiries: only safe characters before the @.
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Public: the careers application form.
export async function create(req, res) {
  const { name, email, phone, city, role, portfolio, social, intro, _gotcha } = req.body ?? {};

  // Bot trap: real visitors never fill this hidden field
  if (_gotcha) return res.status(201).json({ ok: true });

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null;

  const n = clean(name, 100);
  const e = clean(email, 255);
  const p = clean(phone, 50);
  const c = clean(city, 100);
  const r = clean(role, 150);
  const w = clean(portfolio, 500);
  const i = clean(intro, 5000);

  if (!n || !e || !EMAIL.test(e) || !p || !c || !r || !i) {
    return res.status(400).json({
      ok: false,
      error: 'name, a valid email, phone, city, role and intro are required',
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO applications (name, email, phone, city, role_title, portfolio, social, intro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [n, e, p, c, r, w, clean(social, 500), i]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error('Insert application failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not save application' });
  }
}

const APPLICATION_STATUSES = ['new', 'reviewing', 'shortlisted', 'rejected'];

// Admin: the latest 100.
export async function list(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, city, role_title, portfolio, social, intro, status, created_at
       FROM applications ORDER BY created_at DESC LIMIT 100`
    );
    res.json({ ok: true, applications: rows });
  } catch (err) {
    console.error('List applications failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load applications' });
  }
}

export async function updateStatus(req, res) {
  const id = toId(req.params.id);
  const status = req.body?.status;
  if (!id || !APPLICATION_STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: `Valid id and status (${APPLICATION_STATUSES.join(', ')}) are required` });
  }
  try {
    const [r] = await pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Application not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update application status failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update application' });
  }
}

export async function remove(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM applications WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Application not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete application failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete application' });
  }
}