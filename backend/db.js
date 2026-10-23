import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';

// Only used for hosted databases (e.g. Aiven). Local dev leaves DB_SSL unset.
const ssl =
  process.env.DB_SSL === 'true'
    ? { ca: readFileSync(new URL('./aiven-ca.pem', import.meta.url), 'utf8') }
    : undefined;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl,
});