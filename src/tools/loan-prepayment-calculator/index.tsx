"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculatePrepayment, type PrepaymentMode } from "./logic";

const modeOptions: { value: PrepaymentMode; label: string }[] = [
  { value: "reduce-tenure", label: "Reduce Tenure" },
  { value: "reduce-emi", label: "Reduce EMI" },
];

function monthsToYearsMonths(totalMonths: number): string {
  const months = Math.max(0, Math.round(totalMonths));
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

export default function LoanPrepaymentCalculator() {
  const tool = getToolBySlug("loan-prepayment-calculator")!;
  const currency = useCurrency();
  const [loanAmount, setLoanAmount] = useState(20_00_000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [prepayment, setPrepayment] = useState(2_00_000);
  const [mode, setMode] = useState<PrepaymentMode>("reduce-tenure");

  const result = useMemo(
    () => calculatePrepayment(loanAmount, rate, tenure, prepayment, mode),
    [loanAmount, rate, tenure, prepayment, mode]
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
                label="Loan Amount"
                valueInr={loanAmount}
                minInr={1_00_000}
                maxInr={2_00_00_000}
                stepInr={10_000}
                onChangeInr={setLoanAmount}
              />
              <SliderField
                label="Interest Rate (p.a)"
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
                label="Original Tenure"
                value={tenure}
                min={1}
                max={30}
                step={1}
                onChange={setTenure}
                suffix="Y"
                minCaption="1 Y"
                maxCaption="30 Y"
              />
              <MoneySliderField
                label="Prepayment Amount"
                valueInr={prepayment}
                minInr={0}
                maxInr={loanAmount}
                stepInr={10_000}
                onChangeInr={setPrepayment}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-white sm:text-lg">After Prepayment</p>
              <Tabs options={modeOptions} value={mode} onChange={setMode} />
              <p className="text-xs text-white/40">
                {mode === "reduce-tenure"
                  ? "Keep paying the same EMI — loan finishes sooner."
                  : "Keep the same tenure — pay a smaller EMI each month."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Interest Saved"
              value={<AnimatedNumber value={Math.max(0, result.interestSaved)} format={(v) => currency.format(v)} />}
              rows={[
                {
                  label: mode === "reduce-tenure" ? "New Tenure" : "New EMI",
                  value: mode === "reduce-tenure" ? monthsToYearsMonths(result.newTenureMonths) : currency.format(result.newEmi),
                },
                { label: "Time Saved", value: monthsToYearsMonths(result.tenureReducedMonths) },
                { label: "New Total Interest", value: currency.format(Math.max(0, result.newTotalInterest)) },
              ]}
            />

            <Card className="flex flex-col gap-3 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Without Prepayment</p>
              <div className="flex items-center justify-between border-b border-white/5 py-2">
                <p className="text-sm text-white/60">Original EMI</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.originalEmi)}</p>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 py-2">
                <p className="text-sm text-white/60">Original Tenure</p>
                <p className="text-sm font-semibold text-white">{monthsToYearsMonths(result.originalTenureMonths)}</p>
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm text-white/60">Original Total Interest</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.originalTotalInterest)}</p>
              </div>
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
