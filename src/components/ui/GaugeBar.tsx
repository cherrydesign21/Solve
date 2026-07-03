"use client";

export interface GaugeZone {
  label: string;
  color: string;
  upTo: number;
}

interface GaugeBarProps {
  value: number;
  min: number;
  max: number;
  zones: GaugeZone[];
  minLabel?: string;
  maxLabel?: string;
}

export function GaugeBar({ value, min, max, zones, minLabel, maxLabel }: GaugeBarProps) {
  const clampedValue = Math.min(max, Math.max(min, value));
  const pct = max > min ? ((clampedValue - min) / (max - min)) * 100 : 0;

  const segments = zones.reduce<{ items: (GaugeZone & { widthPct: number })[]; prevUpTo: number }>(
    (acc, zone) => {
      const from = acc.prevUpTo;
      const to = Math.min(zone.upTo, max);
      const widthPct = Math.max(0, ((to - from) / (max - min)) * 100);
      return { items: [...acc.items, { ...zone, widthPct }], prevUpTo: zone.upTo };
    },
    { items: [], prevUpTo: min }
  ).items;

  const activeZone = zones.find((zone) => value <= zone.upTo) ?? zones[zones.length - 1];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-3 w-full">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {segments.map((seg, i) => (
            <div key={i} style={{ width: `${seg.widthPct}%`, backgroundColor: seg.color }} />
          ))}
        </div>
        <div
          className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[left] duration-500 ease-out"
          style={{ left: `${pct}%`, boxShadow: "0 0 0 2px rgba(0,0,0,0.6)" }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-white/40">
        <span>{minLabel ?? min}</span>
        <span className="text-sm font-semibold normal-case tracking-normal" style={{ color: activeZone?.color }}>
          {activeZone?.label}
        </span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}
