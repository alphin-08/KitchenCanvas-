import pool from './database.js';

(async () => {
    try {
        const result = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connected! Test result:', result.rows[0].result);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    } finally {
        await pool.end();
    }
})();
