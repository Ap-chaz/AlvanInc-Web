import express from 'express';
import { pool } from './db.js';

const app = express();
const PORT = 3000;
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'alvaninc-backend', time: new Date().toISOString() });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok });
  } catch (err) {
    console.error('DB check failed:', err.code);
    res.status(500).json({ ok: false, error: 'Database unavailable' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  const { name, email, company, selling, pkg, budget, timeline } = req.body ?? {};

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null;

  const n = clean(name, 100);
  const e = clean(email, 255);

  if (!n || !e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});