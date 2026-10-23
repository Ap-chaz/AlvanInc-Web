import { pool } from '../../db.js';
import { toId, text, order } from '../lib/validate.js';

const PACKAGE_NEED = 'name, price_label, pitch and a features list (1-20 items) are required';

function parsePackage(b) {
  const name = text(b?.name, 100);
  const price = text(b?.price_label, 60);
  const pitch = text(b?.pitch, 300);
  const note = typeof b?.price_note === 'string' ? b.price_note.trim().slice(0, 60) : '';
  const features = Array.isArray(b?.features) ? b.features.map((f) => text(f, 200)) : null;
  if (!name || !price || !pitch || !features || features.length > 20 || features.some((f) => !f)) return null;
  return { name, price, note, pitch, featured: b.featured === true ? 1 : 0, sort: order(b.sort_order), features };
}

// Saves a package and its features together. id = null creates; otherwise updates.
// Returns the package id, or null when updating an id that doesn't exist.
async function writePackage(id, p) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (id) {
      const [r] = await conn.execute(
        `UPDATE packages SET name = ?, price_label = ?, price_note = ?, pitch = ?, featured = ?, sort_order = ?
         WHERE id = ?`,
        [p.name, p.price, p.note, p.pitch, p.featured, p.sort, id]
      );
      if (r.affectedRows === 0) { await conn.rollback(); return null; }
      await conn.execute('DELETE FROM package_features WHERE package_id = ?', [id]);
    } else {
      const [r] = await conn.execute(
        `INSERT INTO packages (name, price_label, price_note, pitch, featured, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [p.name, p.price, p.note, p.pitch, p.featured, p.sort]
      );
      id = r.insertId;
    }
    for (const [i, f] of p.features.entries()) {
      await conn.execute(
        'INSERT INTO package_features (package_id, feature, sort_order) VALUES (?, ?, ?)', [id, f, i + 1]
      );
    }
    await conn.commit();
    return id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Public
export async function list(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.name, p.price_label, p.price_note, p.pitch, p.featured, p.sort_order, f.feature
       FROM packages p
       LEFT JOIN package_features f ON f.package_id = p.id
       ORDER BY p.sort_order, p.id, f.sort_order, f.id`
    );
    const packages = [];
    for (const r of rows) {
      let p = packages.find((x) => x.id === r.id);
      if (!p) {
        p = {
          id: r.id, name: r.name, price: r.price_label, priceNote: r.price_note,
          pitch: r.pitch, featured: Boolean(r.featured), sortOrder: r.sort_order, features: []
        };
        packages.push(p);
      }
      if (r.feature) p.features.push(r.feature);
    }
    res.json({ ok: true, packages });
  } catch (err) {
    console.error('Load packages failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load packages' });
  }
}

// Admin
export async function create(req, res) {
  const p = parsePackage(req.body);
  if (!p) return res.status(400).json({ ok: false, error: PACKAGE_NEED });
  try {
    res.status(201).json({ ok: true, id: await writePackage(null, p) });
  } catch (err) {
    console.error('Create package failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create package' });
  }
}

export async function update(req, res) {
  const id = toId(req.params.id);
  const p = parsePackage(req.body);
  if (!id || !p) return res.status(400).json({ ok: false, error: `Valid id; ${PACKAGE_NEED}` });
  try {
    const saved = await writePackage(id, p);
    if (!saved) return res.status(404).json({ ok: false, error: 'Package not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update package failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update package' });
  }
}

export async function remove(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM packages WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Package not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete package failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete package' });
  }
}
