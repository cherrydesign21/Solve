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
import { calculateGoalSip } from "./logic";

export default function GoalSipCalculator() {
  const tool = getToolBySlug("goal-sip-calculator")!;
  const currency = useCurrency();
  const [targetAmount, setTargetAmount] = useState(50_00_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const result = useMemo(() => calculateGoalSip(targetAmount, rate, years), [targetAmount, rate, years]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <MoneySliderField
              label="Target Amount"
              valueInr={targetAmount}
              minInr={1_00_000}
              maxInr={5_00_00_000}
              stepInr={50_000}
              onChangeInr={setTargetAmount}
            />
            <SliderField
              label="Expected Return Rate (p.a)"
              value={rate}
              min={1}
              max={30}
              step={0.1}
              decimals={1}
              onChange={setRate}
              suffix="%"
              minCaption="1%"
              maxCaption="30%"
            />
            <SliderField
              label="Time Period"
              value={years}
              min={1}
              max={40}
              step={1}
              onChange={setYears}
              suffix="Y"
              minCaption="1 Y"
              maxCaption="40 Y"
            />
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Required Monthly SIP"
              value={<AnimatedNumber value={result.requiredMonthlyInvestment} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Target Amount", value: currency.format(targetAmount) },
                { label: "Total Invested", value: currency.format(result.totalInvested) },
                { label: "Wealth Gained", value: currency.format(result.totalReturns) },
              ]}
            />

            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.totalInvested, color: "#363d0a" },
                  { value: result.totalReturns, color: "#d9ff00" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">Goal</p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  {currency.format(targetAmount)}
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: "Your Investment", color: "#363d0a" },
                  { label: "Wealth Gained", color: "#d9ff00" },
                ]}
              />
            </div>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
