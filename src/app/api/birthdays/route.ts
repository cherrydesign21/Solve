import { NextRequest, NextResponse } from "next/server";
import { dbErrorMessage, ensureBirthdaysTable, getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface BirthdayRow {
  id: string;
  name: string;
  dob: string;
}

export async function GET() {
  try {
    await ensureBirthdaysTable();
    const sql = getSql();
    // Email is intentionally never returned to the client — it's only used
    // server-side by the reminder cron job, since this list has no auth boundary.
    const rows = (await sql`
      SELECT id, name, dob::text AS dob FROM birthdays ORDER BY created_at ASC
    `) as BirthdayRow[];
    return NextResponse.json({ birthdays: rows });
  } catch (error) {
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const dob = typeof body.dob === "string" ? body.dob.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";

    if (!name || !dob || !email) {
      return NextResponse.json({ error: "Name, date of birth and email are all required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (Number.isNaN(new Date(dob).getTime())) {
      return NextResponse.json({ error: "Enter a valid date of birth." }, { status: 400 });
    }

    await ensureBirthdaysTable();
    const sql = getSql();
    const id = crypto.randomUUID();
    await sql`INSERT INTO birthdays (id, name, dob, email) VALUES (${id}, ${name}, ${dob}, ${email})`;

    return NextResponse.json({ id, name, dob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 500 });
  }
}
