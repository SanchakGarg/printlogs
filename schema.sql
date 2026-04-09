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
