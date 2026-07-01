"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, PartyPopper, Cake } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { getToolBySlug } from "@/lib/tools-registry";
import type { BirthdayEntry } from "./types";
import { computeBirthday, describeCountdown, formatDob, sortByUpcoming } from "./logic";

const STORAGE_KEY = "solve.birthdayReminder.v1";

function loadEntries(): BirthdayEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BirthdayEntry[]) : [];
  } catch {
    return [];
  }
}

export default function BirthdayReminder() {
  const tool = getToolBySlug("birthday-reminder")!;
  const [entries, setEntries] = useState<BirthdayEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // localStorage is only available client-side; reading it post-mount (rather than in
    // the useState initializer) keeps the server-rendered and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadEntries());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

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

  const canAdd = Boolean(name.trim() && dob);

  const addEntry = () => {
    if (!canAdd) return;
    const entry: BirthdayEntry = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: name.trim(),
      dob,
    };
    setEntries((prev) => [...prev, entry]);
    setName("");
    setDob("");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div>
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <div className="flex flex-col gap-6">
        <Card className="p-5 sm:p-8">
          <p className="mb-4 text-base font-medium text-white sm:text-lg">Add a birthday</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TextField
              value={name}
              onChange={setName}
              placeholder="Name"
              aria-label="Name"
              className="sm:flex-1"
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
        </Card>

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
              <p className="text-sm font-medium uppercase tracking-wide text-white/60">
                Turning <span className="text-2xl font-semibold text-accent">{spotlight.turningAge}</span>
              </p>
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

        {hydrated && upcoming.length === 0 && (
          <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Cake className="h-9 w-9 text-white/30" />
            <p className="text-white/50">No birthdays saved yet. Add one above to start tracking.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
