import { pool } from '../db.js';
import { TIERS } from '../../AlvanInc/src/lib/alvan-data.js';

const conn = await pool.getConnection();
try {
  const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM packages');
  if (n > 0) {
    console.error('packages is not empty. Aborting so nothing is duplicated.');
    process.exit(1);
  }

  await conn.beginTransaction();
  for (const [ti, t] of TIERS.entries()) {
    const [res] = await conn.execute(
      `INSERT INTO packages (name, price_label, price_note, pitch, featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [t.name, t.price, t.priceNote ?? '', t.pitch, t.featured ? 1 : 0, ti + 1]
    );
    for (const [fi, f] of t.features.entries()) {
      await conn.execute(
        'INSERT INTO package_features (package_id, feature, sort_order) VALUES (?, ?, ?)',
        [res.insertId, f, fi + 1]
      );
    }
  }
  await conn.commit();
  console.log(`Seeded ${TIERS.length} packages.`);
} catch (err) {
  await conn.rollback();
  console.error('Seed failed, nothing saved:', err.code ?? err.message);
} finally {
  conn.release();
  await pool.end();
}