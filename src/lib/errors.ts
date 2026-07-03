// Thrown when a server-side feature is missing required configuration (env vars).
// Callers should log the detailed message server-side and show a generic,
// non-technical message to the client — never the raw env var name.
export class MissingConfigError extends Error {}
