import type { BirthdayEntry } from "./types";

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from: Date, to: Date): number {
  const ms = atMidnight(to).getTime() - atMidnight(from).getTime();
  return Math.round(ms / 86_400_000);
}

function getNextOccurrence(dob: Date, today: Date): Date {
  const todayMid = atMidnight(today);
  let next = new Date(todayMid.getFullYear(), dob.getMonth(), dob.getDate());
  if (next < todayMid) {
    next = new Date(todayMid.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  return next;
}

export interface BirthdayComputed extends BirthdayEntry {
  daysUntil: number;
  turningAge: number;
  currentAge: number;
  nextDate: Date;
  isToday: boolean;
}

export function computeBirthday(entry: BirthdayEntry, today: Date = new Date()): BirthdayComputed {
  const dob = new Date(`${entry.dob}T00:00:00`);
  const next = getNextOccurrence(dob, today);
  const daysUntil = daysBetween(today, next);
  const turningAge = next.getFullYear() - dob.getFullYear();

  return {
    ...entry,
    daysUntil,
    turningAge,
    currentAge: turningAge - 1,
    nextDate: next,
    isToday: daysUntil === 0,
  };
}

export function sortByUpcoming(entries: BirthdayEntry[], today: Date = new Date()): BirthdayComputed[] {
  return entries.map((entry) => computeBirthday(entry, today)).sort((a, b) => a.daysUntil - b.daysUntil);
}

export function describeCountdown(days: number): string {
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function formatDob(dob: string): string {
  const date = new Date(`${dob}T00:00:00`);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}
