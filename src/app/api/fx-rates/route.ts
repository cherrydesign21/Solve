import { NextResponse } from "next/server";

// Server-side proxy for FX rates: avoids client-side ad-blocker/CORS flakiness
// when calling the third-party API directly, and caches the upstream response
// for an hour so we don't hammer the free-tier rate limit on every page load.
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Upstream FX API returned ${res.status}`);
    const data = (await res.json()) as { result?: string };
    if (data.result !== "success") throw new Error("Upstream FX API reported failure");

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("[fx-rates] upstream fetch failed:", error);
    return NextResponse.json({ result: "error" }, { status: 502 });
  }
}
