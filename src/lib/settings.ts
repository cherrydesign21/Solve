import { ensureSettingsTable, getSql } from "./db";
import { MissingConfigError } from "./errors";

export interface AdsenseSettings {
  enabled: boolean;
  publisherId: string;
  horizontalSlotId: string;
  verticalSlotId: string;
}

const DEFAULT_ADSENSE_SETTINGS: AdsenseSettings = {
  enabled: false,
  publisherId: "",
  horizontalSlotId: "",
  verticalSlotId: "",
};

const ADSENSE_KEYS = {
  enabled: "adsense_enabled",
  publisherId: "adsense_publisher_id",
  horizontalSlotId: "adsense_horizontal_slot_id",
  verticalSlotId: "adsense_vertical_slot_id",
} as const;

interface SettingRow {
  key: string;
  value: string;
}

// Cached briefly so every page render (RootLayout reads this on every request)
// doesn't hit Postgres — AdSense config changes rarely enough that a short TTL
// is an acceptable staleness trade-off.
let cache: { value: AdsenseSettings; expiresAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

async function fetchAdsenseSettings(): Promise<AdsenseSettings> {
  await ensureSettingsTable();
  const sql = getSql();
  const rows = (await sql`
    SELECT key, value FROM app_settings WHERE key IN ${sql(Object.values(ADSENSE_KEYS))}
  `) as SettingRow[];
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    enabled: map.get(ADSENSE_KEYS.enabled) === "true",
    publisherId: map.get(ADSENSE_KEYS.publisherId) ?? "",
    horizontalSlotId: map.get(ADSENSE_KEYS.horizontalSlotId) ?? "",
    verticalSlotId: map.get(ADSENSE_KEYS.verticalSlotId) ?? "",
  };
}

const TIMEOUT = Symbol("timeout");

export async function getAdsenseSettings(): Promise<AdsenseSettings> {
  if (cache && cache.expiresAt > Date.now()) return cache.value;
  try {
    // This runs unconditionally in the root layout on every page — a purely
    // cosmetic lookup (whether to inject an ad script) must never be allowed
    // to hold up the entire site, so it gets its own short, hard deadline on
    // top of the connection's statement_timeout.
    const result = await Promise.race([
      fetchAdsenseSettings(),
      new Promise<typeof TIMEOUT>((resolve) => setTimeout(() => resolve(TIMEOUT), 4000)),
    ]);
    if (result === TIMEOUT) {
      // Don't cache a timeout fallback — a single slow read (e.g. a cold
      // Supabase connection) would otherwise "poison" every request for the
      // next 30s with a false "disabled" reading. Let the next request try
      // the database fresh instead.
      return DEFAULT_ADSENSE_SETTINGS;
    }
    cache = { value: result, expiresAt: Date.now() + CACHE_TTL_MS };
    return result;
  } catch (error) {
    if (!(error instanceof MissingConfigError)) console.error("[settings] failed to load AdSense settings:", error);
    return DEFAULT_ADSENSE_SETTINGS;
  }
}

export async function saveAdsenseSettings(input: AdsenseSettings): Promise<void> {
  await ensureSettingsTable();
  const sql = getSql();
  const rows: SettingRow[] = [
    { key: ADSENSE_KEYS.enabled, value: String(input.enabled) },
    { key: ADSENSE_KEYS.publisherId, value: input.publisherId.trim() },
    { key: ADSENSE_KEYS.horizontalSlotId, value: input.horizontalSlotId.trim() },
    { key: ADSENSE_KEYS.verticalSlotId, value: input.verticalSlotId.trim() },
  ];
  for (const row of rows) {
    await sql`
      INSERT INTO app_settings (key, value) VALUES (${row.key}, ${row.value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }
  cache = null;
}
