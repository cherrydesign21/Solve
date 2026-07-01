import type { ReactNode } from "react";
import clsx from "clsx";

interface ResultRow {
  label: string;
  value: ReactNode;
}

interface ResultCardProps {
  heading: string;
  value: ReactNode;
  rows: ResultRow[];
  className?: string;
}

export function ResultCard({ heading, value, rows, className }: ResultCardProps) {
  return (
    <div className={clsx("w-full overflow-hidden rounded-xl border border-white/10", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-accent px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/70 sm:text-sm">{heading}</p>
        <p className="text-xl font-semibold text-black sm:text-2xl">{value}</p>
      </div>
      <div className="flex flex-col gap-5 bg-white/[0.06] px-6 py-6 sm:px-8 sm:py-8">
        {rows.map((row, i) => (
          <div key={i} className={clsx("flex flex-col gap-1", i > 0 && "border-t border-white/10 pt-5")}>
            <p className="text-sm text-white/60">{row.label}</p>
            <p className="text-xl font-semibold tracking-wide text-white sm:text-2xl">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
