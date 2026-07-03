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
import { calculatePpf } from "./logic";

export default function PpfCalculator() {
  const tool = getToolBySlug("ppf-calculator")!;
  const currency = useCurrency();
  const [annualContribution, setAnnualContribution] = useState(1_00_000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const result = useMemo(
    () => calculatePpf(annualContribution, rate, years),
    [annualContribution, rate, years]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <MoneySliderField
              label="Annual Investment"
              valueInr={annualContribution}
              minInr={500}
              maxInr={1_50_000}
              stepInr={500}
              onChangeInr={setAnnualContribution}
            />
            <SliderField
              label="Interest Rate (p.a)"
              value={rate}
              min={5}
              max={9}
              step={0.1}
              decimals={1}
              onChange={setRate}
              suffix="%"
              minCaption="5%"
              maxCaption="9%"
            />
            <SliderField
              label="Tenure"
              value={years}
              min={15}
              max={30}
              step={1}
              onChange={setYears}
              suffix="Y"
              minCaption="15 Y"
              maxCaption="30 Y"
            />
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.totalInvested, color: "#363d0a" },
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
                  { label: "Invested", color: "#363d0a" },
                  { label: "Interest Earned", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Maturity Value"
              value={<AnimatedNumber value={result.maturityAmount} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Total Invested", value: currency.format(result.totalInvested) },
                { label: "Total Interest Earned", value: currency.format(result.totalInterest) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        India&apos;s PPF scheme caps annual contributions at ₹1,50,000, has a 15-year lock-in, and can be
        extended in blocks of 5 years. Interest is set quarterly by the government — 7.1% is a recent
        reference rate, not guaranteed.
      </p>
    </div>
  );
}
