"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateRentVsBuy } from "./logic";

export default function RentVsBuyCalculator() {
  const tool = getToolBySlug("rent-vs-buy-calculator")!;
  const currency = useCurrency();

  const [homePrice, setHomePrice] = useState(60_00_000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRatePct, setLoanRatePct] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [rentIncreasePct, setRentIncreasePct] = useState(5);
  const [homeAppreciationPct, setHomeAppreciationPct] = useState(6);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(10);
  const [horizonYears, setHorizonYears] = useState(10);

  const result = useMemo(
    () =>
      calculateRentVsBuy({
        homePrice,
        downPaymentPct,
        loanRatePct,
        loanTenureYears,
        monthlyRent,
        rentIncreasePct,
        homeAppreciationPct,
        investmentReturnPct,
        horizonYears,
      }),
    [
      homePrice,
      downPaymentPct,
      loanRatePct,
      loanTenureYears,
      monthlyRent,
      rentIncreasePct,
      homeAppreciationPct,
      investmentReturnPct,
      horizonYears,
    ]
  );

  const winnerLabel = result.cheaper === "buy" ? "Buying" : "Renting";

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <div className="flex flex-col gap-6">
              <p className="text-base font-medium text-white sm:text-lg">Home Purchase</p>
              <div className="flex flex-col gap-8 sm:gap-10">
                <MoneySliderField
                  label="Home Price"
                  valueInr={homePrice}
                  minInr={10_00_000}
                  maxInr={5_00_00_000}
                  stepInr={1_00_000}
                  onChangeInr={setHomePrice}
                />
                <SliderField
                  label="Down Payment"
                  value={downPaymentPct}
                  min={5}
                  max={80}
                  step={1}
                  onChange={setDownPaymentPct}
                  suffix="%"
                  minCaption="5%"
                  maxCaption="80%"
                />
                <SliderField
                  label="Loan Interest Rate"
                  value={loanRatePct}
                  min={1}
                  max={15}
                  step={0.1}
                  decimals={1}
                  onChange={setLoanRatePct}
                  suffix="%"
                  minCaption="1%"
                  maxCaption="15%"
                />
                <SliderField
                  label="Loan Tenure"
                  value={loanTenureYears}
                  min={5}
                  max={30}
                  step={1}
                  onChange={setLoanTenureYears}
                  suffix="Y"
                  minCaption="5 Y"
                  maxCaption="30 Y"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-base font-medium text-white sm:text-lg">Renting</p>
              <div className="flex flex-col gap-8 sm:gap-10">
                <MoneySliderField
                  label="Monthly Rent"
                  valueInr={monthlyRent}
                  minInr={2_000}
                  maxInr={2_00_000}
                  stepInr={1_000}
                  onChangeInr={setMonthlyRent}
                />
                <SliderField
                  label="Annual Rent Increase"
                  value={rentIncreasePct}
                  min={0}
                  max={15}
                  step={0.5}
                  decimals={1}
                  onChange={setRentIncreasePct}
                  suffix="%"
                  minCaption="0%"
                  maxCaption="15%"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-base font-medium text-white sm:text-lg">Assumptions</p>
              <div className="flex flex-col gap-8 sm:gap-10">
                <SliderField
                  label="Home Appreciation"
                  value={homeAppreciationPct}
                  min={0}
                  max={15}
                  step={0.5}
                  decimals={1}
                  onChange={setHomeAppreciationPct}
                  suffix="%"
                  minCaption="0%"
                  maxCaption="15%"
                />
                <SliderField
                  label="Investment Return (on savings)"
                  value={investmentReturnPct}
                  min={0}
                  max={20}
                  step={0.5}
                  decimals={1}
                  onChange={setInvestmentReturnPct}
                  suffix="%"
                  minCaption="0%"
                  maxCaption="20%"
                />
                <SliderField
                  label="Time Horizon"
                  value={horizonYears}
                  min={1}
                  max={30}
                  step={1}
                  onChange={setHorizonYears}
                  suffix="Y"
                  minCaption="1 Y"
                  maxCaption="30 Y"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading={`${winnerLabel} Wins By`}
              value={<AnimatedNumber value={Math.abs(result.difference)} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Net Cost of Buying", value: currency.format(result.buyNetCost) },
                { label: "Net Cost of Renting", value: currency.format(result.rentNetCost) },
                {
                  label: "Breakeven Point",
                  value: result.breakevenYear ? `${result.breakevenYear} yr` : `Beyond ${horizonYears} yr`,
                },
              ]}
            />

            <Card className="flex flex-col gap-3 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                After {horizonYears} Years
              </p>
              <div className="flex items-center justify-between border-b border-white/5 py-2">
                <p className="text-sm text-white/60">Total EMI Paid</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.totalEmiPaid)}</p>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 py-2">
                <p className="text-sm text-white/60">Home Equity Built</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.homeEquity)}</p>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 py-2">
                <p className="text-sm text-white/60">Total Rent Paid</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.totalRentPaid)}</p>
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm text-white/60">Investment Corpus (Renting)</p>
                <p className="text-sm font-semibold text-white">{currency.format(result.investmentCorpus)}</p>
              </div>
            </Card>

            <Card className="flex items-start gap-3 p-5 sm:p-6">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-xs text-white/40">
                Assumes the renter invests the monthly gap between the EMI and rent at your chosen return rate.
                Illustrative estimate — not financial advice.
              </p>
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
