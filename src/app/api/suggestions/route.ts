import { NextResponse } from "next/server";
import pool, { initDB } from "@/lib/db";

export async function GET() {
  await initDB();

  const [printNames, printerNames, materials, personNames, personEmails] = await Promise.all([
    pool.query("SELECT DISTINCT print_name FROM print_logs ORDER BY print_name"),
    pool.query("SELECT DISTINCT printer_name FROM print_logs ORDER BY printer_name"),
    pool.query("SELECT DISTINCT material FROM print_logs ORDER BY material"),
    pool.query("SELECT DISTINCT person_name FROM print_logs ORDER BY person_name"),
    pool.query("SELECT DISTINCT person_email FROM print_logs ORDER BY person_email"),
  ]);

  return NextResponse.json({
    print_names: printNames.rows.map((r) => r.print_name),
    printer_names: printerNames.rows.map((r) => r.printer_name),
    materials: materials.rows.map((r) => r.material),
    person_names: personNames.rows.map((r) => r.person_name),
    person_emails: personEmails.rows.map((r) => r.person_email),
  });
}
