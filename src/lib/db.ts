import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (client) return client;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Add a Postgres database (Vercel Storage → Neon) to your project, or set " +
        "DATABASE_URL manually, to enable birthday reminders."
    );
  }
  client = neon(connectionString);
  return client;
}

let tableReady: Promise<void> | null = null;

export function ensureBirthdaysTable(): Promise<void> {
  if (!tableReady) {
    const sql = getSql();
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS birthdays (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dob DATE NOT NULL,
        email TEXT NOT NULL,
        last_notified_year INT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return tableReady;
}

export function dbErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected server error.";
}
