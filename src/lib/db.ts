import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS print_logs (
      id SERIAL PRIMARY KEY,
      print_name TEXT NOT NULL,
      printer_name TEXT NOT NULL,
      material TEXT NOT NULL,
      weight_grams NUMERIC(10,2),
      person_name TEXT NOT NULL,
      person_email TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
