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
import { calculateEmi, loanTypeConfig, type LoanType } from "./logic";

const tabOptions: { value: LoanType; label: string }[] = [
  { value: "personal", label: "Personal Loan" },
  { value: "home", label: "Home Loan" },
  { value: "car", label: "Car Loan" },
];

export default function EmiCalculator() {
  const tool = getToolBySlug("emi-calculator")!;
  const currency = useCurrency();
  const [loanType, setLoanType] = useState<LoanType>("personal");
  const config = loanTypeConfig[loanType];

  const [amount, setAmount] = useState(config.defaultAmount);
  const [rate, setRate] = useState(config.defaultRate);
  const [tenure, setTenure] = useState(config.defaultTenure);

  const handleLoanTypeChange = (next: LoanType) => {
    const nextConfig = loanTypeConfig[next];
    setLoanType(next);
    setAmount(nextConfig.defaultAmount);
    setRate(nextConfig.defaultRate);
    setTenure(nextConfig.defaultTenure);
  };

  const result = useMemo(() => calculateEmi(amount, rate, tenure), [amount, rate, tenure]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={tabOptions} value={loanType} onChange={handleLoanTypeChange} />

            <div className="flex flex-col gap-8 sm:gap-10">
              <MoneySliderField
                label="Loan Amount"
                valueInr={amount}
                minInr={config.amountMin}
                maxInr={config.amountMax}
                stepInr={config.amountStep}
                onChangeInr={setAmount}
              />
              <SliderField
                label="Interest Rate (p.a)"
                value={rate}
                min={config.rateMin}
                max={config.rateMax}
                step={0.1}
                decimals={1}
                onChange={setRate}
                suffix="%"
                minCaption={`${config.rateMin}%`}
                maxCaption={`${config.rateMax}%`}
              />
              <SliderField
                label="Tenure (Years)"
                value={tenure}
                min={config.tenureMin}
                max={config.tenureMax}
                step={1}
                onChange={setTenure}
                suffix="Y"
                minCaption={`${config.tenureMin} Y`}
                maxCaption={`${config.tenureMax} Y`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Monthly EMI"
              value={<AnimatedNumber value={result.emi} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Principal Amount", value: currency.format(result.principal) },
                { label: "Total Interest", value: currency.format(result.totalInterest) },
                { label: "Total Amount", value: currency.format(result.totalAmount) },
              ]}
            />

            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.principal, color: "#363d0a" },
                  { value: result.totalInterest, color: "#d9ff00" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                  Monthly EMI
                </p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  <AnimatedNumber value={result.emi} format={(v) => currency.format(v)} />
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: "Principal Amount", color: "#363d0a" },
                  { label: "Interest Amount", color: "#d9ff00" },
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
