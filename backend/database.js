// import mysql from 'mysql2/promise'; // Use promise-based connections
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();
// Create a connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, 
    },
});

export default pool;