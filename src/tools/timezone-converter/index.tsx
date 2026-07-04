"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Clock } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { SelectField } from "@/components/ui/SelectField";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { getToolBySlug } from "@/lib/tools-registry";
import {
  formatInZone,
  getTimeZones,
  offsetDifferenceLabel,
  resolveZone,
  toDateTimeLocalValue,
  zonedWallTimeToUtc,
  zoneLabel,
} from "./logic";

const zones = getTimeZones();

export default function TimezoneConverter() {
  const tool = getToolBySlug("timezone-converter")!;
  const [dateTimeLocal, setDateTimeLocal] = useState("");
  const [fromZone, setFromZone] = useState(() => resolveZone(zones, "Asia/Kolkata", "Asia/Calcutta"));
  const [toZone, setToZone] = useState(() => resolveZone(zones, "America/New_York"));
  const [referenceDate, setReferenceDate] = useState<Date | null>(null);

  useEffect(() => {
    // Client-only: seed from the visitor's current local time to avoid an SSR/client mismatch.
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateTimeLocal(toDateTimeLocalValue(now));
    setReferenceDate(now);
  }, []);

  const zoneOptions = zones.map((z) => ({ value: z, label: referenceDate ? zoneLabel(z, referenceDate) : z }));

  const instant = dateTimeLocal ? zonedWallTimeToUtc(dateTimeLocal, fromZone) : null;

  const swap = () => {
    setFromZone(toZone);
    setToZone(fromZone);
  };

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="mx-auto max-w-3xl p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-white">Date &amp; Time</p>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => setDateTimeLocal(e.target.value)}
              aria-label="Date and time"
              className="w-full rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none [color-scheme:dark] focus:border-accent/60 sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">From</p>
              <SelectField options={zoneOptions} value={fromZone} onChange={setFromZone} ariaLabel="From time zone" />
            </div>

            <button
              type="button"
              onClick={swap}
              aria-label="Swap time zones"
              className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 transition-colors hover:border-accent/60 hover:text-accent"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">To</p>
              <SelectField options={zoneOptions} value={toZone} onChange={setToZone} ariaLabel="To time zone" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-accent px-6 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/70 sm:text-sm">
                Converted Time
              </p>
              <p className="text-2xl font-bold text-black sm:text-3xl">
                {instant ? formatInZone(instant, toZone) : "—"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] px-6 py-4 sm:px-8">
              <Clock className="h-4 w-4 shrink-0 text-white/40" />
              <p className="text-sm text-white/50">
                {instant ? offsetDifferenceLabel(fromZone, toZone, instant) : "Pick a date and time to convert"}
              </p>
            </div>
          </div>

          <VerticalAdSlot />
        </div>
      </Card>

      <ToolExplainer>
        <p>
          Time zone offsets aren&apos;t fixed — they shift with daylight saving time, and different
          countries switch on different dates. This looks up the real offset for both zones on the exact
          date you picked, so a conversion in July can differ from the same conversion in January even for
          the same two cities.
        </p>
        <p>
          That&apos;s also why scheduling a recurring meeting across zones can drift by an hour part of the
          year — always double-check the date you actually care about rather than assuming today&apos;s
          offset holds year-round.
        </p>
      </ToolExplainer>
    </div>
  );
}
