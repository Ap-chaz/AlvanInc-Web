import { pool } from '../../db.js';
import { toId } from '../lib/validate.js';

const ENQUIRY_STATUSES = ['new', 'read', 'replied', 'archived'];

// Only letters, digits and . _ % + - are allowed before the @, so the admin "Reply" link can't be tampered with.
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Public: the contact form.
export async function create(req, res) {
  const { name, email, company, selling, pkg, budget, timeline, _gotcha } = req.body ?? {};

  // Bot trap: real visitors never fill this hidden field
  if (_gotcha) return res.status(201).json({ ok: true });

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null;

  const n = clean(name, 100);
  const e = clean(email, 255);

  if (!n || !e || !EMAIL.test(e)) {
    return res.status(400).json({ ok: false, error: 'Name and a valid email are required' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO enquiries (name, email, company, selling, package_interest, budget, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [n, e, clean(company, 150), clean(selling, 2000), clean(pkg, 100), clean(budget, 100), clean(timeline, 100)]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error('Insert enquiry failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not save enquiry' });
  }
}

// Admin: the latest 100.
export async function list(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, company, selling, package_interest, budget, timeline, status, created_at
       FROM enquiries ORDER BY created_at DESC LIMIT 100`
    );
    res.json({ ok: true, enquiries: rows });
  } catch (err) {
    console.error('List enquiries failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load enquiries' });
  }
}

export async function updateStatus(req, res) {
  const id = toId(req.params.id);
  const status = req.body?.status;
  if (!id || !ENQUIRY_STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: `Valid id and status (${ENQUIRY_STATUSES.join(', ')}) are required` });
  }
  try {
    const [r] = await pool.execute('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Enquiry not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update enquiry status failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update enquiry' });
  }
}

export async function remove(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM enquiries WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Enquiry not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete enquiry failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete enquiry' });
  }
}
