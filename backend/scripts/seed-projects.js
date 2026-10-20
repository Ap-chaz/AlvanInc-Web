import { pool } from '../db.js';
import { PROJECTS, CATEGORIES } from '../../AlvanInc/src/lib/alvan-data.js';

const conn = await pool.getConnection();
try {
  for (const table of ['categories', 'projects']) {
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM ${table}`);
    if (n > 0) {
      console.error(`${table} is not empty. Aborting so nothing is duplicated.`);
      process.exit(1);
    }
  }

  await conn.beginTransaction();

  const categoryIds = {};
  const names = CATEGORIES.filter((c) => c !== 'All');
  for (const [i, name] of names.entries()) {
    const [res] = await conn.execute(
      'INSERT INTO categories (name, sort_order) VALUES (?, ?)', [name, i + 1]
    );
    categoryIds[name] = res.insertId;
  }

  for (const [pi, p] of PROJECTS.entries()) {
    const categoryId = categoryIds[p.category];
    if (!categoryId) throw new Error(`Unknown category: ${p.category}`);

    const [res] = await conn.execute(
      `INSERT INTO projects (slug, name, category_id, summary, brief, live_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.slug, p.name, categoryId, p.summary, p.brief, p.liveUrl ?? null, pi + 1]
    );
    for (const [i, tag] of (p.tags ?? []).entries()) {
      await conn.execute(
        'INSERT INTO project_tags (project_id, tag, sort_order) VALUES (?, ?, ?)',
        [res.insertId, tag, i + 1]
      );
    }
    for (const [i, a] of (p.approach ?? []).entries()) {
      await conn.execute(
        'INSERT INTO project_approach_steps (project_id, title, body, sort_order) VALUES (?, ?, ?, ?)',
        [res.insertId, a.title, a.body, i + 1]
      );
    }
  }

  await conn.commit();
  console.log(`Seeded ${names.length} categories and ${PROJECTS.length} projects.`);
} catch (err) {
  await conn.rollback();
  console.error('Seed failed, nothing saved:', err.code ?? err.message);
} finally {
  conn.release();
  await pool.end();
}