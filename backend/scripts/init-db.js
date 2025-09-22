import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import pool from '../database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const sqlPath = resolve(__dirname, '../sql/init.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  console.log('Applying schema from', sqlPath);
  try {
    await pool.query(sql);
    console.log('Schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize schema:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
