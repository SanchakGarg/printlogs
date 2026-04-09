import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

export async function initDB() {
  // Create fresh table (new installs)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS print_logs (
      id           SERIAL PRIMARY KEY,
      log_id       UUID DEFAULT gen_random_uuid() NOT NULL,
      print_name   TEXT NOT NULL,
      printer_name TEXT NOT NULL,
      material     TEXT NOT NULL,
      weight_grams NUMERIC(10,2),
      person_name  TEXT NOT NULL,
      person_email TEXT NOT NULL,
      description  TEXT,
      printed_at   DATE DEFAULT CURRENT_DATE NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Migrate existing tables that are missing the new columns
  await pool.query(`
    ALTER TABLE print_logs ADD COLUMN IF NOT EXISTS log_id     UUID DEFAULT gen_random_uuid();
    ALTER TABLE print_logs ADD COLUMN IF NOT EXISTS printed_at DATE DEFAULT CURRENT_DATE;
  `);

  // Back-fill any NULLs left by the migration
  await pool.query(`
    UPDATE print_logs SET log_id     = gen_random_uuid()    WHERE log_id     IS NULL;
    UPDATE print_logs SET printed_at = created_at::date     WHERE printed_at IS NULL;
  `);
}
