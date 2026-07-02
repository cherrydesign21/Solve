import postgres from "postgres";

let client: postgres.Sql | null = null;

export function getSql(): postgres.Sql {
  if (client) return client;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Add your Supabase (or other Postgres) connection string in Vercel's " +
        "Environment Variables to enable birthday reminders."
    );
  }
  client = postgres(connectionString, {
    ssl: "require",
    prepare: false, // required for Supabase's pgbouncer transaction-mode pooler
    max: 1, // one connection per serverless instance; the pooler handles fan-out
  });
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
    `
      .then(() => undefined)
      .catch((error) => {
        tableReady = null; // don't cache a failed attempt — let the next call retry
        throw error;
      });
  }
  return tableReady;
}

export function dbErrorMessage(error: unknown): string {
  console.error("[db error]", error);
  if (error instanceof Error) {
    const withCode = error as Error & { code?: string; detail?: string };
    const parts = [withCode.name, withCode.code, error.message, withCode.detail].filter(Boolean);
    return parts.length > 0 ? parts.join(" — ") : "Unexpected server error (empty error message).";
  }
  return `Unexpected server error: ${String(error)}`;
}
