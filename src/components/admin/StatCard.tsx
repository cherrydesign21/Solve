import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/40">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-3xl font-semibold text-white">{value}</p>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </Card>
  );
}
