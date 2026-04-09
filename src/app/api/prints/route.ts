import { NextRequest, NextResponse } from "next/server";
import pool, { initDB } from "@/lib/db";

export async function GET() {
  await initDB();
  const result = await pool.query(
    "SELECT * FROM print_logs ORDER BY printed_at DESC, created_at DESC"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  await initDB();
  const body = await req.json();
  const {
    print_name, printer_name, material,
    weight_grams, person_name, person_email,
    description, printed_at,
  } = body;

  if (!print_name || !printer_name || !material || !person_name || !person_email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO print_logs
       (print_name, printer_name, material, weight_grams, person_name, person_email, description, printed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      print_name, printer_name, material,
      weight_grams || null,
      person_name, person_email,
      description || null,
      printed_at || null,   // NULL → DB DEFAULT (CURRENT_DATE)
    ]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
