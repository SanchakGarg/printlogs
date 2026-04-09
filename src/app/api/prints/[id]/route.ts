import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await pool.query(
    "DELETE FROM print_logs WHERE id = $1 RETURNING id",
    [id]
  );
  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: id });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    `UPDATE print_logs SET
       print_name   = $1,
       printer_name = $2,
       material     = $3,
       weight_grams = $4,
       person_name  = $5,
       person_email = $6,
       description  = $7,
       printed_at   = $8
     WHERE id = $9
     RETURNING *`,
    [
      print_name, printer_name, material,
      weight_grams || null,
      person_name, person_email,
      description || null,
      printed_at || null,
      id,
    ]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}
