import { NextRequest, NextResponse } from "next/server";
import { ensurePageViewsTable, getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;
    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    await ensurePageViewsTable();
    const sql = getSql();
    await sql`INSERT INTO page_views (path, referrer) VALUES (${path}, ${referrer})`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Analytics is best-effort — never let a tracking failure surface to visitors.
    console.error("[track] failed to record page view:", error);
    return NextResponse.json({ ok: false });
  }
}
