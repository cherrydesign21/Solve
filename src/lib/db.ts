import postgres from "postgres";
import { MissingConfigError } from "./errors";

let client: postgres.Sql | null = null;

export function getSql(): postgres.Sql {
  if (client) return client;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new MissingConfigError(
      "Missing DATABASE_URL. Add your Supabase (or other Postgres) connection string in Vercel's " +
        "Environment Variables to enable birthday reminders."
    );
  }
  client = postgres(connectionString, {
    ssl: "require",
    prepare: false, // required for Supabase's pgbouncer transaction-mode pooler
    max: 1, // one connection per serverless instance; the pooler handles fan-out
    connect_timeout: 10, // seconds
    // Without this, a stalled query (e.g. a paused Supabase project waking up)
    // can hang until Vercel's own function-duration ceiling kills the whole
    // invocation minutes later — this makes Postgres itself cancel the query
    // after 10s so callers get a fast, clear error instead.
    connection: { statement_timeout: 10_000 },
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

let contactTableReady: Promise<void> | null = null;

export function ensureContactMessagesTable(): Promise<void> {
  if (!contactTableReady) {
    const sql = getSql();
    contactTableReady = sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
      .then(() => undefined)
      .catch((error) => {
        contactTableReady = null;
        throw error;
      });
  }
  return contactTableReady;
}

let settingsTableReady: Promise<void> | null = null;

export function ensureSettingsTable(): Promise<void> {
  if (!settingsTableReady) {
    const sql = getSql();
    settingsTableReady = sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `
      .then(() => undefined)
      .catch((error) => {
        settingsTableReady = null;
        throw error;
      });
  }
  return settingsTableReady;
}

let pageViewsTableReady: Promise<void> | null = null;

export function ensurePageViewsTable(): Promise<void> {
  if (!pageViewsTableReady) {
    const sql = getSql();
    pageViewsTableReady = sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id BIGSERIAL PRIMARY KEY,
        path TEXT NOT NULL,
        referrer TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
      .then(() => undefined)
      .catch((error) => {
        pageViewsTableReady = null;
        throw error;
      });
  }
  return pageViewsTableReady;
}

export function dbErrorMessage(error: unknown): string {
  if (error instanceof MissingConfigError) {
    // Log the real cause server-side only — never surface env var names to the client.
    console.error("[birthday-reminder] feature unavailable:", error.message);
    return "Reminders aren't available right now — please check back soon.";
  }
  console.error("[db error]", error);
  if (error instanceof Error) {
    const withCode = error as Error & { code?: string; detail?: string };
    const parts = [withCode.name, withCode.code, error.message, withCode.detail].filter(Boolean);
    return parts.length > 0 ? parts.join(" — ") : "Unexpected server error (empty error message).";
  }
  return `Unexpected server error: ${String(error)}`;
}
