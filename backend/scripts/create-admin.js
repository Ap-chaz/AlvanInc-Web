import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const email = (await rl.question('Admin email: ')).trim().toLowerCase();
const password = await rl.question('Admin password (min 12 chars): ');
rl.close();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12) {
  console.error('Invalid email, or password shorter than 12 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

try {
  await pool.execute('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [email, hash]);
  console.log('Admin created.');
} catch (err) {
  console.error(err.code === 'ER_DUP_ENTRY' ? 'That email already exists.' : `Failed: ${err.code}`);
} finally {
  await pool.end();
}