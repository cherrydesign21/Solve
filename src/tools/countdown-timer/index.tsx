"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { getToolBySlug } from "@/lib/tools-registry";
import { computeCountdown, defaultTarget, toDateTimeLocalValue } from "./logic";

function UnitBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-6 sm:py-8">
      <p className="text-3xl font-bold tabular-nums text-accent sm:text-4xl lg:text-5xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50 sm:text-xs">{label}</p>
    </div>
  );
}

export default function CountdownTimer() {
  const tool = getToolBySlug("countdown-timer")!;
  const [eventName, setEventName] = useState("");
  const [targetLocal, setTargetLocal] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Client-only: seed target/now from the visitor's local clock to avoid an SSR/client mismatch.
    const current = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(current);
    setTargetLocal(toDateTimeLocalValue(defaultTarget(current)));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const target = targetLocal ? new Date(targetLocal) : null;
  const breakdown = target && now ? computeCountdown(target, now) : null;

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="mx-auto max-w-3xl p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Event Name (optional)</p>
              <TextField value={eventName} onChange={setEventName} placeholder="e.g. Product Launch" aria-label="Event name" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Target Date &amp; Time</p>
              <input
                type="datetime-local"
                value={targetLocal}
                onChange={(e) => setTargetLocal(e.target.value)}
                aria-label="Target date and time"
                className="w-full rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none [color-scheme:dark] focus:border-accent/60 sm:text-base"
              />
            </div>
          </div>

          {breakdown?.isPast ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-6 py-10 text-center">
              <PartyPopper className="h-8 w-8 text-accent" />
              <p className="text-lg font-semibold text-white">
                {eventName.trim() || "This moment"} has arrived!
              </p>
              <p className="text-sm text-white/50">
                {breakdown.days > 0 && `${breakdown.days}d `}
                {breakdown.hours > 0 && `${breakdown.hours}h `}
                {breakdown.minutes > 0 && `${breakdown.minutes}m `}
                ago
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {eventName.trim() && (
                <p className="text-center text-sm font-medium uppercase tracking-[0.16em] text-white/50">
                  Countdown to {eventName.trim()}
                </p>
              )}
              <div className="flex gap-2 sm:gap-4">
                <UnitBlock value={breakdown?.days ?? 0} label="Days" />
                <UnitBlock value={breakdown?.hours ?? 0} label="Hours" />
                <UnitBlock value={breakdown?.minutes ?? 0} label="Minutes" />
                <UnitBlock value={breakdown?.seconds ?? 0} label="Seconds" />
              </div>
            </div>
          )}

          <VerticalAdSlot />
        </div>
      </Card>

      <ToolExplainer>
        <p>
          The countdown recalculates every second from the difference between your target date/time and
          the current time on your device, split into whole days, hours, minutes and seconds. Once the
          target passes, it flips to showing how long ago it happened instead.
        </p>
        <p>
          Because it uses your browser&apos;s local clock and time zone, the target date/time you set is
          interpreted in your own local time — sharing the page won&apos;t automatically adjust for someone
          viewing it from a different time zone.
        </p>
      </ToolExplainer>
    </div>
  );
}
