import { NextResponse } from "next/server";
import pool, { initDB } from "@/lib/db";

const DEFAULT_PRINTERS = ["Ava", "Eva", "June", "November"];

export async function GET() {
  await initDB();

  const [printNames, printerNames, personNames, personEmails] = await Promise.all([
    pool.query("SELECT DISTINCT print_name FROM print_logs ORDER BY print_name"),
    pool.query("SELECT DISTINCT printer_name FROM print_logs ORDER BY printer_name"),
    pool.query("SELECT DISTINCT person_name FROM print_logs ORDER BY person_name"),
    pool.query("SELECT DISTINCT person_email FROM print_logs ORDER BY person_email"),
  ]);

  const dbPrinters = printerNames.rows.map((r) => r.printer_name);
  const allPrinters = Array.from(new Set([...DEFAULT_PRINTERS, ...dbPrinters])).sort();

  return NextResponse.json({
    print_names:  printNames.rows.map((r) => r.print_name),
    printer_names: allPrinters,
    person_names:  personNames.rows.map((r) => r.person_name),
    person_emails: personEmails.rows.map((r) => r.person_email),
  });
}
