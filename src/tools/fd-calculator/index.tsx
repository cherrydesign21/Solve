"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateFd } from "./logic";

export default function FdCalculator() {
  const tool = getToolBySlug("fd-calculator")!;
  const currency = useCurrency();
  const [principal, setPrincipal] = useState(1_00_000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const result = useMemo(() => calculateFd(principal, rate, years), [principal, rate, years]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <MoneySliderField
              label="Deposit Amount"
              valueInr={principal}
              minInr={1_000}
              maxInr={1_00_00_000}
              stepInr={1_000}
              onChangeInr={setPrincipal}
            />
            <SliderField
              label="Interest Rate (p.a)"
              value={rate}
              min={3}
              max={12}
              step={0.05}
              decimals={2}
              onChange={setRate}
              suffix="%"
              minCaption="3%"
              maxCaption="12%"
            />
            <SliderField
              label="Tenure"
              value={years}
              min={0.25}
              max={10}
              step={0.25}
              decimals={2}
              onChange={setYears}
              suffix="Y"
              minCaption="3 mo"
              maxCaption="10 Y"
            />
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
                  { label: "Deposit", color: "#363d0a" },
                  { label: "Interest Earned", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Maturity Value"
              value={<AnimatedNumber value={result.maturityAmount} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Deposit Amount", value: currency.format(principal) },
                { label: "Total Interest Earned", value: currency.format(result.totalInterest) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">Assumes quarterly compounding, standard for most Indian bank fixed deposits.</p>
    </div>
  );
}
