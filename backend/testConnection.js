import pool from './database.js';

(async () => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connected! Test result:', rows[0].result);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
})();
