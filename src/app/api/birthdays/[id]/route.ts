import { NextRequest, NextResponse } from "next/server";
import { dbErrorMessage, ensureBirthdaysTable, getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await ensureBirthdaysTable();
    const sql = getSql();
    await sql`DELETE FROM birthdays WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 500 });
  }
}
