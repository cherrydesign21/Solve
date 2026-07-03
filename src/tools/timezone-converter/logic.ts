const FALLBACK_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Australia/Perth",
  "Pacific/Auckland",
];

// A handful of legacy IANA links some ICU builds still report instead of the modern canonical city name.
const LEGACY_CITY_NAMES: Record<string, string> = {
  Calcutta: "Kolkata",
  Rangoon: "Yangon",
  Saigon: "Ho Chi Minh City",
  Kiev: "Kyiv",
};

export function resolveZone(zones: string[], ...candidates: string[]): string {
  for (const candidate of candidates) {
    if (zones.includes(candidate)) return candidate;
  }
  return zones[0] ?? "UTC";
}

export function getTimeZones(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return FALLBACK_ZONES;
    }
  }
  return FALLBACK_ZONES;
}

export function timeZoneOffsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(at)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

export function zonedWallTimeToUtc(dateTimeLocal: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateTimeLocal}:00Z`);
  const offsetMinutes = timeZoneOffsetMinutes(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offsetMinutes * 60_000);
}

export function formatOffsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

export function zoneLabel(timeZone: string, at: Date): string {
  return `${zoneShortName(timeZone)} (${formatOffsetLabel(timeZoneOffsetMinutes(at, timeZone))})`;
}

export function formatInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(instant);
}

export function offsetDifferenceLabel(fromZone: string, toZone: string, at: Date): string {
  const fromOffset = timeZoneOffsetMinutes(at, fromZone);
  const toOffset = timeZoneOffsetMinutes(at, toZone);
  const diff = toOffset - fromOffset;
  if (diff === 0) return "Same time in both zones";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const parts = [h ? `${h}h` : null, m ? `${m}m` : null].filter(Boolean).join(" ");
  return `${zoneShortName(toZone)} is ${parts} ${diff > 0 ? "ahead of" : "behind"} ${zoneShortName(fromZone)}`;
}

function zoneShortName(timeZone: string): string {
  const city = timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone;
  return LEGACY_CITY_NAMES[city] ?? city;
}

export function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
