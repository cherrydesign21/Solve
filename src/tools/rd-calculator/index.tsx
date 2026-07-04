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
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateRd } from "./logic";

export default function RdCalculator() {
  const tool = getToolBySlug("rd-calculator")!;
  const currency = useCurrency();
  const [monthlyDeposit, setMonthlyDeposit] = useState(5_000);
  const [rate, setRate] = useState(6.5);
  const [tenureMonths, setTenureMonths] = useState(24);

  const result = useMemo(
    () => calculateRd(monthlyDeposit, rate, tenureMonths),
    [monthlyDeposit, rate, tenureMonths]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <MoneySliderField
              label="Monthly Deposit"
              valueInr={monthlyDeposit}
              minInr={500}
              maxInr={1_00_000}
              stepInr={500}
              onChangeInr={setMonthlyDeposit}
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
              value={tenureMonths}
              min={6}
              max={120}
              step={1}
              onChange={setTenureMonths}
              suffix="mo"
              minCaption="6 mo"
              maxCaption="120 mo"
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
                  { label: "Deposited", color: "#363d0a" },
                  { label: "Interest Earned", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Maturity Value"
              value={<AnimatedNumber value={result.maturityAmount} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Total Deposited", value: currency.format(result.totalInvested) },
                { label: "Total Interest Earned", value: currency.format(result.totalInterest) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          A Recurring Deposit compounds quarterly like a fixed deposit, but each monthly instalment starts
          earning interest from the date it&apos;s deposited rather than all at once — so the first
          instalment earns interest for the full tenure while the last one earns very little.
        </p>
        <p>
          RDs are popular for building a savings habit toward a specific goal, since they lock in today&apos;s
          interest rate while letting you contribute gradually instead of needing a lump sum upfront like
          an FD.
        </p>
      </ToolExplainer>
    </div>
  );
}
