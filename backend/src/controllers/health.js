import { pool } from '../../db.js';

export function health(req, res) {
  res.json({ ok: true, service: 'alvaninc-backend', time: new Date().toISOString() });
}

export async function healthDb(req, res) {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok });
  } catch (err) {
    console.error('DB check failed:', err.code);
    res.status(500).json({ ok: false, error: 'Database unavailable' });
  }
}
