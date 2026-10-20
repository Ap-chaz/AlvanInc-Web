import { pool } from '../db.js';
import { SERVICES, PROCESS_STEPS } from '../../AlvanInc/src/lib/alvan-data.js';

const conn = await pool.getConnection();
try {
  for (const table of ['services', 'process_steps']) {
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM ${table}`);
    if (n > 0) {
      console.error(`${table} is not empty. Aborting so nothing is duplicated.`);
      process.exit(1);
    }
  }

  await conn.beginTransaction();
  for (const [i, s] of SERVICES.entries()) {
    await conn.execute(
      'INSERT INTO services (name, tier, body, sort_order) VALUES (?, ?, ?, ?)',
      [s.name, s.tier, s.body, i + 1]
    );
  }
  for (const [i, p] of PROCESS_STEPS.entries()) {
    await conn.execute(
      'INSERT INTO process_steps (name, duration, body, sort_order) VALUES (?, ?, ?, ?)',
      [p.name, p.duration, p.body, i + 1]
    );
  }
  await conn.commit();
  console.log(`Seeded ${SERVICES.length} services and ${PROCESS_STEPS.length} process steps.`);
} catch (err) {
  await conn.rollback();
  console.error('Seed failed, nothing saved:', err.code ?? err.message);
} finally {
  conn.release();
  await pool.end();
}