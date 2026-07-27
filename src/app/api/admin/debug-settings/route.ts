import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { ensureSettingsTable, getSql } from "@/lib/db";
import { saveAdsenseSettings } from "@/lib/settings";

// TEMPORARY diagnostic route — remove once the AdSense settings read/write
// issue is confirmed fixed.
export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await ensureSettingsTable();
    const sql = getSql();
    const rows = await sql`SELECT key, value FROM app_settings ORDER BY key`;
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await saveAdsenseSettings({
      enabled: true,
      publisherId: "ca-pub-8018807637358062",
      horizontalSlotId: "",
      verticalSlotId: "",
    });
    const sql = getSql();
    const rows = await sql`SELECT key, value FROM app_settings ORDER BY key`;
    return NextResponse.json({ ok: true, rowsAfterSave: rows });
  } catch (error) {
    return NextResponse.json({ error: String(error), stack: (error as Error)?.stack }, { status: 500 });
  }
}
