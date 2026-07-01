"use client";

import type { ReactNode } from "react";

interface Segment {
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export function DonutChart({ segments, size = 240, strokeWidth = 22, children }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce<{ items: (Segment & { dash: number; offset: number })[]; offset: number }>(
    (acc, segment) => {
      const fraction = Math.max(0, segment.value) / total;
      const dash = fraction * circumference;
      return {
        items: [...acc.items, { ...segment, dash, offset: acc.offset }],
        offset: acc.offset + dash,
      };
    },
    { items: [], offset: 0 }
  ).items;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap={arcs.length > 1 ? "butt" : "round"}
            style={{
              transition:
                "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-[15%] flex flex-col items-center justify-center rounded-full bg-panel text-center shadow-[inset_0_0_18px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}

export function DonutLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <span className="h-2.5 w-5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm font-medium text-white">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
