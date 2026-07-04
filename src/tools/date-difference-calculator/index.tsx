"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { ResultCard } from "@/components/ui/ResultCard";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { addDays, calculateDateDiff, toDateInputValue } from "./logic";

export default function DateDifferenceCalculator() {
  const tool = getToolBySlug("date-difference-calculator")!;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    // Client-only: seed both dates from the visitor's local clock to avoid an SSR/client mismatch.
    const today = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFromDate(toDateInputValue(today));
    setToDate(toDateInputValue(addDays(today, 30)));
  }, []);

  const result =
    fromDate && toDate ? calculateDateDiff(new Date(`${fromDate}T00:00:00`), new Date(`${toDate}T00:00:00`)) : null;

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">From Date</p>
              <TextField type="date" value={fromDate} onChange={setFromDate} aria-label="From date" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">To Date</p>
              <TextField type="date" value={toDate} onChange={setToDate} aria-label="To date" />
            </div>

            {result && (
              <Card className="flex items-start gap-3 p-5 sm:p-6">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-xs text-white/40">
                  {result.isPast ? "The from date is after the to date, so this is the gap between them." : "Counting forward from the from date to the to date."}
                </p>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            {result ? (
              <ResultCard
                heading="Difference"
                value={`${result.years}y ${result.months}m ${result.days}d`}
                rows={[
                  { label: "Total Days", value: formatNumber(result.totalDays) },
                  { label: "Total Weeks", value: formatNumber(result.totalWeeks) },
                  { label: "Total Months", value: formatNumber(result.totalMonths) },
                  { label: "Business Days (Mon–Fri)", value: formatNumber(result.businessDays) },
                ]}
              />
            ) : (
              <Card className="flex flex-col items-center gap-3 p-8 text-center">
                <CalendarDays className="h-6 w-6 text-accent" />
                <p className="text-sm text-white/50">Pick two dates to see the difference.</p>
              </Card>
            )}

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          The years/months/days breakdown counts calendar units the way you&apos;d say them out loud —
          &quot;2 years, 3 months, 10 days&quot; — while the totals below convert the same span into flat
          days, weeks and months for when you need a single number instead.
        </p>
        <p>
          Business days counts Monday through Friday only, ignoring public holidays since those vary by
          country and region — subtract any known holidays manually if you need an exact working-day count.
        </p>
      </ToolExplainer>
    </div>
  );
}
