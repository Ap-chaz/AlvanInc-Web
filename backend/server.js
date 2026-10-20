import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import express from 'express';
import { pool } from './db.js';
import cors from 'cors';

const app = express();
app.use(helmet());
const PORT = 3000;

const allowedOrigins = (process.env.CORS_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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
      `SELECT g.id AS group_id, g.title, i.question, i.answer
       FROM faq_groups g
       LEFT JOIN faq_items i ON i.group_id = g.id
       ORDER BY g.sort_order, g.id, i.sort_order, i.id`
    );
    const groups = [];
    for (const r of rows) {
      let g = groups.find((x) => x.id === r.group_id);
      if (!g) { g = { id: r.group_id, group: r.title, items: [] }; groups.push(g); }
      if (r.question) g.items.push({ q: r.question, a: r.answer });
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
      `SELECT p.id, p.name, p.price_label, p.price_note, p.pitch, p.featured, f.feature
       FROM packages p
       LEFT JOIN package_features f ON f.package_id = p.id
       ORDER BY p.sort_order, p.id, f.sort_order, f.id`
    );
    const packages = [];
    for (const r of rows) {
      let p = packages.find((x) => x.id === r.id);
      if (!p) {
        p = { id: r.id, name: r.name, price: r.price_label, priceNote: r.price_note,
              pitch: r.pitch, featured: Boolean(r.featured), features: [] };
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
      'SELECT id, name, tier, body FROM services ORDER BY sort_order, id'
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
    `SELECT p.id, p.slug, p.name, p.summary, p.brief, p.live_url, c.name AS category
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
    slug: p.slug,
    name: p.name,
    category: p.category,
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