import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function seed() {
  const seedFile = path.join(__dirname, '..', 'seeds', 'seed.sql');
  const sql = fs.readFileSync(seedFile, 'utf8');

  console.log('Running seed...');
  await pool.query(sql);
  console.log('  ✓ Seed completed.');

  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
