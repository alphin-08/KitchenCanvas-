// import mysql from 'mysql2/promise'; // Use promise-based connections
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();
// Create a connection pool
const sslConfig = (() => {
    // If a base64-encoded CA cert is provided, enforce proper verification
    const caBase64 = process.env.DB_CA_CERT_BASE64;
    if (caBase64 && caBase64.trim() !== '') {
        const ca = Buffer.from(caBase64, 'base64').toString('utf-8');
        return { ca, rejectUnauthorized: true };
    }
    // Fallback: allow self-signed/managed certs (convenience for RDS quick start)
    return { rejectUnauthorized: false };
})();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
    ssl: sslConfig,
});

export default pool;