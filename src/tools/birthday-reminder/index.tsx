"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, PartyPopper, Cake, Mail, AlertTriangle } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { getToolBySlug } from "@/lib/tools-registry";
import type { BirthdayEntry } from "./types";
import { computeBirthday, describeCountdown, formatDob, sortByUpcoming } from "./logic";

interface ApiError {
  error: string;
}

export default function BirthdayReminder() {
  const tool = getToolBySlug("birthday-reminder")!;
  const [entries, setEntries] = useState<BirthdayEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/birthdays");
        const data = (await res.json()) as { birthdays?: BirthdayEntry[] } & Partial<ApiError>;
        if (!res.ok) throw new Error(data.error ?? "Failed to load birthdays.");
        if (!cancelled) setEntries(data.birthdays ?? []);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Failed to load birthdays.");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const upcoming = useMemo(() => sortByUpcoming(entries, now), [entries, now]);
  const spotlight = upcoming[0];
  const rest = upcoming.slice(1);

  const preview = useMemo(() => {
    if (!name.trim() || !dob) return null;
    return computeBirthday({ id: "preview", name: name.trim(), dob }, now);
  }, [name, dob, now]);

  const canAdd = Boolean(name.trim() && dob && email.trim()) && !submitting;

  const addEntry = async () => {
    if (!canAdd) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), dob, email: email.trim() }),
      });
      const data = (await res.json()) as BirthdayEntry & Partial<ApiError>;
      if (!res.ok) throw new Error(data.error ?? "Failed to add birthday.");
      setEntries((prev) => [...prev, { id: data.id, name: data.name, dob: data.dob }]);
      setName("");
      setDob("");
      setEmail("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to add birthday.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeEntry = async (id: string) => {
    const previous = entries;
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    try {
      const res = await fetch(`/api/birthdays/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove birthday.");
    } catch (error) {
      setEntries(previous);
      setSubmitError(error instanceof Error ? error.message : "Failed to remove birthday.");
    }
  };

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <div className="flex flex-col gap-6">
        <Card className="p-5 sm:p-8">
          <p className="mb-1 text-base font-medium text-white sm:text-lg">Add a birthday</p>
          <p className="mb-4 text-xs text-white/40">
            We&apos;ll email a reminder 4 hours before. Names and dates below are visible to anyone on this
            page; email addresses are stored privately and never shown.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TextField
              value={name}
              onChange={setName}
              placeholder="Name"
              aria-label="Name"
              className="sm:flex-1 sm:min-w-[160px]"
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <TextField
              type="date"
              value={dob}
              onChange={setDob}
              aria-label="Date of birth"
              className="sm:w-56"
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <TextField
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email for reminder"
              aria-label="Reminder email"
              className="sm:flex-1 sm:min-w-[200px]"
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <button
              type="button"
              onClick={addEntry}
              disabled={!canAdd}
              className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          <AnimatePresence>
            {preview && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden text-sm text-white/50"
              >
                {preview.name} turns <span className="text-accent">{preview.turningAge}</span>{" "}
                {describeCountdown(preview.daysUntil).toLowerCase()}.
              </motion.p>
            )}
          </AnimatePresence>
          {submitError && (
            <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {submitError}
            </p>
          )}
        </Card>

        {loadError && (
          <Card className="flex items-start gap-3 border-red-500/30 bg-red-500/5 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-300">Birthdays aren&apos;t loading</p>
              <p className="mt-1 text-sm text-white/50">{loadError}</p>
            </div>
          </Card>
        )}

        {spotlight && (
          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-accent px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-2 text-black/70">
                <PartyPopper className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] sm:text-sm">Next up</p>
              </div>
              <p className="text-xl font-semibold text-black sm:text-2xl">
                {describeCountdown(spotlight.daysUntil)}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-8">
              <div>
                <p className="text-lg font-semibold text-white sm:text-xl">{spotlight.name}</p>
                <p className="mt-1 text-sm text-white/50">{formatDob(spotlight.dob)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium uppercase tracking-wide text-white/60">
                  Turning <span className="text-2xl font-semibold text-accent">{spotlight.turningAge}</span>
                </p>
                <button
                  type="button"
                  onClick={() => removeEntry(spotlight.id)}
                  aria-label={`Remove ${spotlight.name}`}
                  className="shrink-0 rounded-md p-2 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        )}

        {rest.length > 0 && (
          <Card className="p-3 sm:p-4">
            <ul className="flex flex-col divide-y divide-white/10">
              <AnimatePresence initial={false}>
                {rest.map((entry) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 px-3 py-4 sm:px-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                      {entry.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white sm:text-base">{entry.name}</p>
                      <p className="text-xs text-white/45 sm:text-sm">{formatDob(entry.dob)}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide sm:text-sm ${
                          entry.daysUntil <= 7 ? "text-accent" : "text-white/60"
                        }`}
                      >
                        {describeCountdown(entry.daysUntil)}
                      </p>
                      <p className="text-xs text-white/40">Turns {entry.turningAge}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      aria-label={`Remove ${entry.name}`}
                      className="shrink-0 rounded-md p-2 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </Card>
        )}

        {loaded && !loadError && upcoming.length === 0 && (
          <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Cake className="h-9 w-9 text-white/30" />
            <p className="text-white/50">No birthdays saved yet. Add one above to start tracking.</p>
          </Card>
        )}

        <p className="flex items-center gap-2 text-xs text-white/30">
          <Mail className="h-3.5 w-3.5" />
          Reminder emails require RESEND_API_KEY and DATABASE_URL to be configured on the server.
        </p>
      </div>
    </div>
  );
}
