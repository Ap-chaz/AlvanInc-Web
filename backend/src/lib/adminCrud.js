import { pool } from '../../db.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { toId, text, order } from './validate.js';

// Registers POST / PUT / DELETE admin routes for a simple table.
// `fields` maps each text column to its max length. Column and table names come from OUR code,
// never from user input; all values still go through ? placeholders.
// `afterChange` (optional) runs after every successful change.
export function adminCrud(router, path, table, fields, label, afterChange = () => {}) {
  const cols = Object.keys(fields);

  const readBody = (body) => {
    const vals = [];
    for (const c of cols) {
      const v = text(body?.[c], fields[c]);
      if (!v) return null;
      vals.push(v);
    }
    vals.push(order(body?.sort_order));
    return vals;
  };
  const need = `${cols.join(', ')} are required`;

  router.post(`/admin/${path}`, requireAdmin, async (req, res) => {
    const vals = readBody(req.body);
    if (!vals) return res.status(400).json({ ok: false, error: need });
    try {
      const [r] = await pool.execute(
        `INSERT INTO ${table} (${cols.join(', ')}, sort_order) VALUES (${vals.map(() => '?').join(', ')})`,
        vals
      );
      afterChange();
      res.status(201).json({ ok: true, id: r.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: `${label} already exists` });
      console.error(`Create ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not create ${label}` });
    }
  });

  router.put(`/admin/${path}/:id`, requireAdmin, async (req, res) => {
    const id = toId(req.params.id);
    const vals = readBody(req.body);
    if (!id || !vals) return res.status(400).json({ ok: false, error: `Valid id; ${need}` });
    try {
      const [r] = await pool.execute(
        `UPDATE ${table} SET ${cols.map((c) => `${c} = ?`).join(', ')}, sort_order = ? WHERE id = ?`,
        [...vals, id]
      );
      if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: `${label} not found` });
      afterChange();
      res.json({ ok: true });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: `${label} already exists` });
      console.error(`Update ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not update ${label}` });
    }
  });

  router.delete(`/admin/${path}/:id`, requireAdmin, async (req, res) => {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
    try {
      const [r] = await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
      if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: `${label} not found` });
      afterChange();
      res.json({ ok: true });
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ ok: false, error: `${label} is still in use` });
      console.error(`Delete ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not delete ${label}` });
    }
  });
}
