import { pool } from '../db.js';
import { FAQ_GROUPS } from '../../AlvanInc/src/lib/alvan-data.js';

const conn = await pool.getConnection();
try {
  const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM faq_groups');
  if (n > 0) {
    console.error('faq_groups is not empty. Aborting so nothing is duplicated.');
    process.exit(1);
  }

  await conn.beginTransaction();
  let questions = 0;
  for (const [gi, g] of FAQ_GROUPS.entries()) {
    const [res] = await conn.execute(
      'INSERT INTO faq_groups (title, sort_order) VALUES (?, ?)', [g.group, gi + 1]
    );
    for (const [ii, item] of g.items.entries()) {
      await conn.execute(
        'INSERT INTO faq_items (group_id, question, answer, sort_order) VALUES (?, ?, ?, ?)',
        [res.insertId, item.q, item.a, ii + 1]
      );
      questions++;
    }
  }
  await conn.commit();
  console.log(`Seeded ${FAQ_GROUPS.length} groups and ${questions} questions.`);
} catch (err) {
  await conn.rollback();
  console.error('Seed failed, nothing saved:', err.code ?? err.message);
} finally {
  conn.release();
  await pool.end();
}