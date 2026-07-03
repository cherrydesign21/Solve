"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateCompoundInterest, compoundingOptions } from "./logic";

const compoundingTabOptions = compoundingOptions.map((c) => ({ value: c.id, label: c.label }));

export default function CompoundInterestCalculator() {
  const tool = getToolBySlug("compound-interest-calculator")!;
  const currency = useCurrency();
  const [principal, setPrincipal] = useState(1_00_000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compoundingId, setCompoundingId] = useState(compoundingOptions[2].id);

  const timesPerYear = compoundingOptions.find((c) => c.id === compoundingId)?.timesPerYear ?? 4;
  const result = useMemo(
    () => calculateCompoundInterest(principal, rate, years, timesPerYear),
    [principal, rate, years, timesPerYear]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <div className="flex flex-col gap-8 sm:gap-10">
              <MoneySliderField
                label="Principal Amount"
                valueInr={principal}
                minInr={1_000}
                maxInr={1_00_00_000}
                stepInr={1_000}
                onChangeInr={setPrincipal}
              />
              <SliderField
                label="Annual Interest Rate"
                value={rate}
                min={1}
                max={20}
                step={0.1}
                decimals={1}
                onChange={setRate}
                suffix="%"
                minCaption="1%"
                maxCaption="20%"
              />
              <SliderField
                label="Time Period"
                value={years}
                min={1}
                max={30}
                step={1}
                onChange={setYears}
                suffix="Y"
                minCaption="1 Y"
                maxCaption="30 Y"
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-white sm:text-lg">Compounding Frequency</p>
              <Tabs options={compoundingTabOptions} value={compoundingId} onChange={setCompoundingId} />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: principal, color: "#363d0a" },
                  { value: result.totalInterest, color: "#d9ff00" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">Maturity</p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  <AnimatedNumber value={result.maturityAmount} format={(v) => currency.format(v)} />
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: "Principal", color: "#363d0a" },
                  { label: "Interest Earned", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Maturity Amount"
              value={<AnimatedNumber value={result.maturityAmount} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Principal", value: currency.format(principal) },
                { label: "Total Interest Earned", value: currency.format(result.totalInterest) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
