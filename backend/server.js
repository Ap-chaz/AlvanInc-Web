import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import express from 'express';
import { pool } from './db.js';
import cors from 'cors';

const app = express();
app.set('trust proxy', 2);
app.get('/api/debug-ip', (req, res) => res.json({ ip: req.ip, xff: req.headers['x-forwarded-for'] }));
app.use(helmet());
const PORT = 3000;

const allowedOrigins = (process.env.CORS_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
// Admin forms (a project with its approach steps, a package with its features) can pass 10kb,
// so signed-in editing gets a larger limit. The public enquiry form keeps the small one.
app.use('/api/admin', express.json({ limit: '100kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/api/admin', (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ ok: false, error: 'Origin not allowed' });
  }
  next();
});


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

const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });

app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
  const { name, email, company, selling, pkg, budget, timeline, _gotcha } = req.body ?? {};

  // Bot trap: real visitors never fill this hidden field
  if (_gotcha) return res.status(201).json({ ok: true });

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null;

  const n = clean(name, 100);
  const e = clean(email, 255);

  if (!n || !e || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(e)) {
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

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

app.post('/api/admin/login', loginLimiter, async (req, res) => {
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
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

function requireAdmin(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies.admin_token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.adminId = payload.sub;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Not authenticated' });
  }
}

// Lets the dashboard ask "is this cookie still valid?" before it renders anything private.
app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ ok: true, id: req.adminId });
});

app.get('/api/enquiries', requireAdmin, async (req, res) => {
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
});

app.get('/api/faq', async (req, res) => {
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
});

app.get('/api/packages', async (req, res) => {
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
});

app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, tier, body, sort_order FROM services ORDER BY sort_order, id'
    );
    res.json({ ok: true, services: rows });
  } catch (err) {
    console.error('Load services failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load services' });
  }
});

app.get('/api/process', async (req, res) => {
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
});

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

app.get('/api/projects', async (req, res) => {
  try {
    res.json({ ok: true, projects: await loadProjects() });
  } catch (err) {
    console.error('Load projects failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load projects' });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    const [project] = await loadProjects(req.params.slug);
    if (!project) return res.status(404).json({ ok: false, error: 'Project not found' });
    res.json({ ok: true, project });
  } catch (err) {
    console.error('Load project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load project' });
  }
});

const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const text = (v, max) => (typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : null);
const order = (v) => (Number.isInteger(v) ? v : 0);

// --- FAQ groups ---
app.post('/api/admin/faq/groups', requireAdmin, async (req, res) => {
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
});

app.put('/api/admin/faq/groups/:id', requireAdmin, async (req, res) => {
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
});

app.delete('/api/admin/faq/groups/:id', requireAdmin, async (req, res) => {
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
});

// --- FAQ items ---
app.post('/api/admin/faq/items', requireAdmin, async (req, res) => {
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
});

app.put('/api/admin/faq/items/:id', requireAdmin, async (req, res) => {
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
});

app.delete('/api/admin/faq/items/:id', requireAdmin, async (req, res) => {
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
});

// Registers POST / PUT / DELETE admin routes for a simple table.
// `fields` maps each text column to its max length. Column and table names come from OUR code below,
// never from user input; all values still go through ? placeholders.
function adminCrud(path, table, fields, label) {
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

  app.post(`/api/admin/${path}`, requireAdmin, async (req, res) => {
    const vals = readBody(req.body);
    if (!vals) return res.status(400).json({ ok: false, error: need });
    try {
      const [r] = await pool.execute(
        `INSERT INTO ${table} (${cols.join(', ')}, sort_order) VALUES (${vals.map(() => '?').join(', ')})`,
        vals
      );
      res.status(201).json({ ok: true, id: r.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: `${label} already exists` });
      console.error(`Create ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not create ${label}` });
    }
  });

  app.put(`/api/admin/${path}/:id`, requireAdmin, async (req, res) => {
    const id = toId(req.params.id);
    const vals = readBody(req.body);
    if (!id || !vals) return res.status(400).json({ ok: false, error: `Valid id; ${need}` });
    try {
      const [r] = await pool.execute(
        `UPDATE ${table} SET ${cols.map((c) => `${c} = ?`).join(', ')}, sort_order = ? WHERE id = ?`,
        [...vals, id]
      );
      if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: `${label} not found` });
      res.json({ ok: true });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: `${label} already exists` });
      console.error(`Update ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not update ${label}` });
    }
  });

  app.delete(`/api/admin/${path}/:id`, requireAdmin, async (req, res) => {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
    try {
      const [r] = await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
      if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: `${label} not found` });
      res.json({ ok: true });
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ ok: false, error: `${label} is still in use` });
      console.error(`Delete ${label} failed:`, err.code);
      res.status(500).json({ ok: false, error: `Could not delete ${label}` });
    }
  });
}

adminCrud('services', 'services', { name: 100, tier: 60, body: 5000 }, 'service');
adminCrud('process', 'process_steps', { name: 100, duration: 60, body: 5000 }, 'process step');

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

const PACKAGE_NEED = 'name, price_label, pitch and a features list (1-20 items) are required';

app.post('/api/admin/packages', requireAdmin, async (req, res) => {
  const p = parsePackage(req.body);
  if (!p) return res.status(400).json({ ok: false, error: PACKAGE_NEED });
  try {
    res.status(201).json({ ok: true, id: await writePackage(null, p) });
  } catch (err) {
    console.error('Create package failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create package' });
  }
});

app.put('/api/admin/packages/:id', requireAdmin, async (req, res) => {
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
});

app.delete('/api/admin/packages/:id', requireAdmin, async (req, res) => {
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
});

adminCrud('categories', 'categories', { name: 100 }, 'category');

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, sort_order FROM categories ORDER BY sort_order, id');
    res.json({ ok: true, categories: rows });
  } catch (err) {
    console.error('Load categories failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not load categories' });
  }
});

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

const PROJECT_NEED =
  'slug (a-z, 0-9, hyphens), name, category_id, summary, brief, tags[] and approach[{title, body}] are required; live_url must be http(s) or empty';

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  const p = parseProject(req.body);
  if (!p) return res.status(400).json({ ok: false, error: PROJECT_NEED });
  try {
    res.status(201).json({ ok: true, id: await writeProject(null, p) });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'A project with that slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ ok: false, error: 'Unknown category_id' });
    console.error('Create project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not create project' });
  }
});

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const id = toId(req.params.id);
  const p = parseProject(req.body);
  if (!id || !p) return res.status(400).json({ ok: false, error: `Valid id; ${PROJECT_NEED}` });
  try {
    const saved = await writeProject(id, p);
    if (!saved) return res.status(404).json({ ok: false, error: 'Project not found' });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'A project with that slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ ok: false, error: 'Unknown category_id' });
    console.error('Update project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not update project' });
  }
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const id = toId(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Valid id is required' });
  try {
    const [r] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ ok: false, error: 'Project not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete project failed:', err.code);
    res.status(500).json({ ok: false, error: 'Could not delete project' });
  }
});

const ENQUIRY_STATUSES = ['new', 'read', 'replied', 'archived'];

app.put('/api/admin/enquiries/:id/status', requireAdmin, async (req, res) => {
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
});

app.delete('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
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
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'Request too large' });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ ok: false, error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});