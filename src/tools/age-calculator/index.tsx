"use client";

import { useEffect, useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { ResultCard } from "@/components/ui/ResultCard";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateAge, toDateInputValue } from "./logic";

export default function AgeCalculator() {
  const tool = getToolBySlug("age-calculator")!;
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState("");

  useEffect(() => {
    // Client-only: seed "as of" with today's local date to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAsOf(toDateInputValue(new Date()));
  }, []);

  const breakdown = dob && asOf ? calculateAge(new Date(`${dob}T00:00:00`), new Date(`${asOf}T00:00:00`)) : null;

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Date of Birth</p>
              <TextField type="date" value={dob} onChange={setDob} aria-label="Date of birth" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Age As Of</p>
              <TextField type="date" value={asOf} onChange={setAsOf} aria-label="Age as of date" />
            </div>

            {breakdown && (
              <Card className="flex items-start gap-3 p-5 sm:p-6">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-xs text-white/40">
                  Born on a {breakdown.bornOnWeekday}.{" "}
                  {breakdown.daysToNextBirthday === 0
                    ? "Birthday is today!"
                    : `Next birthday in ${formatNumber(breakdown.daysToNextBirthday)} day${breakdown.daysToNextBirthday === 1 ? "" : "s"}.`}
                </p>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            {breakdown ? (
              <ResultCard
                heading="Age"
                value={`${breakdown.years}y ${breakdown.months}m ${breakdown.days}d`}
                rows={[
                  { label: "Total Months Lived", value: formatNumber(breakdown.totalMonths) },
                  { label: "Total Weeks Lived", value: formatNumber(breakdown.totalWeeks) },
                  { label: "Total Days Lived", value: formatNumber(breakdown.totalDays) },
                ]}
              />
            ) : (
              <Card className="flex flex-col items-center gap-3 p-8 text-center">
                <Sparkles className="h-6 w-6 text-accent" />
                <p className="text-sm text-white/50">Enter a date of birth to see the full breakdown.</p>
              </Card>
            )}

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
