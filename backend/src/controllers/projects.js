import { pool } from '../../db.js';
import { toId, text, order } from '../lib/validate.js';
import { requestRebuild } from '../lib/rebuild.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PROJECT_NEED =
  'slug (a-z, 0-9, hyphens), name, category_id, summary, brief, tags[] and approach[{title, body}] are required; live_url must be http(s) or empty';

// Reads projects (all, or one by slug) together with their tags and approach steps.
async function loadProjects(slug = null) {
  const [projects] = await pool.execute(
    `SELECT p.id, p.slug, p.name, p.summary, p.brief, p.live_url, p.category_id, p.sort_order, c.name AS category
     FROM projects p JOIN categories c ON c.id = p.category_id
     ${slug ? 'WHERE p.slug = ?' : ''}
     ORDER BY p.sort_order, p.id`,
    slug ? [slug] : []
  );
  if (!projects.length) return [];

  const ids = projects.map((p) => p.id);
  const marks = ids.map(() => '?').join(',');
  const [tags] = await pool.execute(
    `SELECT project_id, tag FROM project_tags WHERE project_id IN (${marks}) ORDER BY sort_order, id`, ids
  );
  const [steps] = await pool.execute(
    `SELECT project_id, title, body FROM project_approach_steps
     WHERE project_id IN (${marks}) ORDER BY sort_order, id`, ids
  );

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryId: p.category_id,
    sortOrder: p.sort_order,
    summary: p.summary,
    brief: p.brief,
    liveUrl: p.live_url,
    tags: tags.filter((t) => t.project_id === p.id).map((t) => t.tag),
    approach: steps.filter((s) => s.project_id === p.id).map(({ title, body }) => ({ title, body })),
    results: [],
  }));
}

function parseProject(b) {
  const slug = text(b?.slug, 100);
  const name = text(b?.name, 150);
  const summary = text(b?.summary, 400);
  const brief = text(b?.brief, 5000);
  const categoryId = toId(b?.category_id);

  let liveUrl = null;
  if (b?.live_url !== null && b?.live_url !== undefined && b?.live_url !== '') {
    liveUrl = text(b.live_url, 300);
    if (!liveUrl || !/^https?:\/\//i.test(liveUrl)) return null;
  }

  const tags = Array.isArray(b?.tags) ? b.tags.map((t) => text(t, 60)) : null;
  const approach = Array.isArray(b?.approach)
    ? b.approach.map((a) => ({ title: text(a?.title, 200), body: text(a?.body, 2000) }))
    : null;

  if (!slug || !SLUG.test(slug) || !name || !summary || !brief || !categoryId) return null;
  if (!tags || tags.length > 10 || tags.some((t) => !t)) return null;
  if (!approach || approach.length > 10 || approach.some((a) => !a.title || !a.body)) return null;

  return { slug, name, summary, brief, categoryId, liveUrl, sort: order(b.sort_order), tags, approach };
}

// Saves a project with its tags and approach steps in one transaction.
// id = null creates; otherwise updates. Returns the id, or null if that id doesn't exist.
async function writeProject(id, p) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (id) {
      const [r] = await conn.execute(
        `UPDATE projects SET slug = ?, name = ?, category_id = ?, summary = ?, brief = ?, live_url = ?, sort_order = ?
         WHERE id = ?`,
        [p.slug, p.name, p.categoryId, p.summary, p.brief, p.liveUrl, p.sort, id]
      );
      if (r.affectedRows === 0) { await conn.rollback(); return null; }
      await conn.execute('DELETE FROM project_tags WHERE project_id = ?', [id]);
      await conn.execute('DELETE FROM project_approach_steps WHERE project_id = ?', [id]);
    } else {
      const [r] = await conn.execute(
        `INSERT INTO projects (slug, name, category_id, summary, brief, live_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [p.slug, p.name, p.categoryId, p.summary, p.brief, p.liveUrl, p.sort]
      );
      id = r.insertId;
    }
    for (const [i, tag] of p.tags.entries()) {
      await conn.execute(
        'INSERT INTO project_tags (project_id, tag, sort_order) VALUES (?, ?, ?)', [id, tag, i + 1]
      );
    }
    for (const [i, a] of p.approach.entries()) {
      await conn.execute(
        'INSERT INTO project_approach_steps (project_id, title, body, sort_order) VALUES (?, ?, ?, ?)',
        [id, a.title, a.body, i + 1]
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
    res.json({ ok: true, projects: await loadProjects() });
  } catch (err) {
    console.error('Load projects failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load projects' });
  }
}

export async function getBySlug(req, res) {
  try {
    const [project] = await loadProjects(req.params.slug);
    if (!project) return res.status(404).json({ ok: false, error: 'Project not found' });
    res.json({ ok: true, project });
  } catch (err) {
    console.error('Load project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load project' });
  }
}

// Admin. Every successful change asks Vercel to rebuild the SEO pages.
export async function create(req, res) {
  const p = parseProject(req.body);
  if (!p) return res.status(400).json({ ok: false, error: PROJECT_NEED });
  try {
    const id = await writeProject(null, p);
    requestRebuild();
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'A project with that slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ ok: false, error: 'Unknown category_id' });
    console.error('Create project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create project' });
  }
}

export async function update(req, res) {
  const id = toId(req.params.id);
  const p = parseProject(req.body);
  if (!id || !p) return res.status(400).json({ ok: false, error: `Valid id; ${PROJECT_NEED}` });
  try {
    const saved = await writeProject(id, p);
    if (!saved) return res.status(404).json({ ok: false, error: 'Project not found' });
    requestRebuild();
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'A project with that slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ ok: false, error: 'Unknown category_id' });
    console.error('Update project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update project' });
  }
}

export async function remove(req, res) {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Project not found' });
    requestRebuild();
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete project' });
  }
}
