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
    `.then(() => undefined);
  }
  return tableReady;
}

export function dbErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected server error.";
}
