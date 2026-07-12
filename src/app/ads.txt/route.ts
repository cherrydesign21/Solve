import { getAdsenseSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getAdsenseSettings();
  // ads.txt uses the bare "pub-XXXX" form; the script tag/data-ad-client
  // attribute use the "ca-pub-XXXX" form — strip the "ca-" prefix here.
  const pubId = settings.publisherId.replace(/^ca-/, "");
  const body = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
