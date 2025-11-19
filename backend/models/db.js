import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Set search_path to use conference_booking schema
    options: '-c search_path=conference_booking,public',
});

(async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL database successfully!");
        client.release(); 
    } catch (err) {
        console.error("Failed to connect to PostgreSQL database:", err.message);
    }
})();

export default pool;
