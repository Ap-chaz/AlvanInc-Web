import { pool } from '../../db.js';

// Public lists: services, process steps and project categories.
export async function listServices(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, tier, body, sort_order FROM services ORDER BY sort_order, id'
    );
    res.json({ ok: true, services: rows });
  } catch (err) {
    console.error('Load services failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load services' });
  }
}

export async function listProcess(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, duration, body, sort_order FROM process_steps ORDER BY sort_order, id'
    );
    const steps = rows.map(({ sort_order, ...r }) => ({
      ...r,
      n: String(sort_order).padStart(2, '0'),
    }));
    res.json({ ok: true, steps });
  } catch (err) {
    console.error('Load process steps failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load process steps' });
  }
}

export async function listCategories(req, res) {
  try {
    const [rows] = await pool.execute('SELECT id, name, sort_order FROM categories ORDER BY sort_order, id');
    res.json({ ok: true, categories: rows });
  } catch (err) {
    console.error('Load categories failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load categories' });
  }
}
