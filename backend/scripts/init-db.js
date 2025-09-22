import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import pool from '../database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const basePath = resolve(__dirname, '../sql/init.sql');
  const baseSql = readFileSync(basePath, 'utf8');

  console.log('Applying base schema from', basePath);
  try {
    await pool.query(baseSql);
    console.log('Base schema applied.');

    // Apply migrations in ../sql/migrations (if any)
    const migrationsDir = resolve(__dirname, '../sql/migrations');
    let files = [];
    try {
      files = readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();
    } catch (e) {
      // no migrations directory; ignore
    }

    for (const file of files) {
      const mPath = resolve(migrationsDir, file);
      console.log('Applying migration', mPath);
      const mSql = readFileSync(mPath, 'utf8');
      await pool.query(mSql);
      console.log('Applied', file);
    }

    console.log('Schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize schema:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
