import { pool } from '../../db.js';
import { toId, text, order } from '../lib/validate.js';

// Public: groups with their questions.
export async function list(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT g.id AS group_id, g.title, g.sort_order AS group_sort,
              i.id AS item_id, i.question, i.answer, i.sort_order AS item_sort
       FROM faq_groups g
       LEFT JOIN faq_items i ON i.group_id = g.id
       ORDER BY g.sort_order, g.id, i.sort_order, i.id`
    );
    const groups = [];
    for (const r of rows) {
      let g = groups.find((x) => x.id === r.group_id);
      if (!g) { g = { id: r.group_id, group: r.title, sortOrder: r.group_sort, items: [] }; groups.push(g); }
      if (r.question) g.items.push({ id: r.item_id, q: r.question, a: r.answer, sortOrder: r.item_sort });
    }
    res.json({ ok: true, groups });
  } catch (err) {
    console.error('Load FAQ failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load FAQ' });
  }
}

// --- Admin: groups ---
export async function createGroup(req, res) {
  const title = text(req.body?.title, 150);
  if (!title) return res.status(400).json({ ok: false, error: 'A title (max 150 chars) is required' });
  try {
    const [r] = await pool.execute(
      'INSERT INTO faq_groups (title, sort_order) VALUES (?, ?)', [title, order(req.body.sort_order)]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    console.error('Create FAQ group failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create group' });
  }
}

export async function updateGroup(req, res) {
  const id = toId(req.params.id);
  const title = text(req.body?.title, 150);
  if (!id || !title) return res.status(400).json({ ok: false, error: 'Valid id and title are required' });
  try {
    const [r] = await pool.execute(
      'UPDATE faq_groups SET title = ?, sort_order = ? WHERE id = ?', [title, order(req.body.sort_order), id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Group not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update FAQ group failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update group' });
  }
}

export async function removeGroup(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM faq_groups WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Group not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete FAQ group failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete group' });
  }
}

// --- Admin: questions ---
export async function createItem(req, res) {
  const groupId = toId(req.body?.group_id);
  const question = text(req.body?.question, 300);
  const answer = text(req.body?.answer, 5000);
  if (!groupId || !question || !answer) {
    return res.status(400).json({ ok: false, error: 'group_id, question and answer are required' });
  }
  try {
    const [r] = await pool.execute(
      'INSERT INTO faq_items (group_id, question, answer, sort_order) VALUES (?, ?, ?, ?)',
      [groupId, question, answer, order(req.body.sort_order)]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ ok: false, error: 'Group not found' });
    }
    console.error('Create FAQ item failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create item' });
  }
}

export async function updateItem(req, res) {
  const id = toId(req.params.id);
  const question = text(req.body?.question, 300);
  const answer = text(req.body?.answer, 5000);
  if (!id || !question || !answer) {
    return res.status(400).json({ ok: false, error: 'Valid id, question and answer are required' });
  }
  try {
    const [r] = await pool.execute(
      'UPDATE faq_items SET question = ?, answer = ?, sort_order = ? WHERE id = ?',
      [question, answer, order(req.body.sort_order), id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Item not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update FAQ item failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update item' });
  }
}

export async function removeItem(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM faq_items WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Item not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete FAQ item failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete item' });
  }
}
