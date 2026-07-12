import { NextRequest, NextResponse } from "next/server";
import { dbErrorMessage, ensureContactMessagesTable, getSql } from "@/lib/db";
import { sendContactFormEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 80) : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim().slice(0, 80) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await ensureContactMessagesTable();
    const sql = getSql();
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO contact_messages (id, first_name, last_name, email, message)
      VALUES (${id}, ${firstName}, ${lastName}, ${email}, ${message})
    `;

    // Best-effort — the message is already saved and visible in the admin
    // dashboard even if the notification email fails to send.
    try {
      await sendContactFormEmail({ firstName, lastName, email, message });
    } catch (error) {
      console.error("[contact] failed to send notification email:", error);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 500 });
  }
}
