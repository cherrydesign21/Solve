import { NextRequest, NextResponse } from "next/server";
import { dbErrorMessage, ensureBirthdaysTable, getSql } from "@/lib/db";
import { sendBirthdayReminderEmail } from "@/lib/email";
import { computeBirthday } from "@/tools/birthday-reminder/logic";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface BirthdayRow {
  id: string;
  name: string;
  dob: string;
  email: string;
  last_notified_year: number | null;
}

// Runs on a schedule (see vercel.json). Sends one email per birthday, once per
// year, when the next occurrence (at UTC midnight) is 3-4 hours away.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureBirthdaysTable();
    const sql = getSql();
    const rows = (await sql`
      SELECT id, name, dob::text AS dob, email, last_notified_year FROM birthdays
    `) as BirthdayRow[];

    const now = new Date();
    let sent = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const computed = computeBirthday({ id: row.id, name: row.name, dob: row.dob }, now);
      const hoursUntil = (computed.nextDate.getTime() - now.getTime()) / 3_600_000;
      const alreadyNotified = row.last_notified_year === computed.nextDate.getFullYear();

      if (alreadyNotified || hoursUntil > 4 || hoursUntil <= 3) continue;

      try {
        await sendBirthdayReminderEmail({ to: row.email, name: row.name, turningAge: computed.turningAge });
        await sql`UPDATE birthdays SET last_notified_year = ${computed.nextDate.getFullYear()} WHERE id = ${row.id}`;
        sent += 1;
      } catch (error) {
        errors.push(`${row.id}: ${dbErrorMessage(error)}`);
      }
    }

    return NextResponse.json({ checked: rows.length, sent, errors });
  } catch (error) {
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 500 });
  }
}
