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
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateLumpsum, calculateSip, type SipMode } from "./logic";

const modeOptions: { value: SipMode; label: string }[] = [
  { value: "sip", label: "Monthly SIP" },
  { value: "lumpsum", label: "Lumpsum" },
];

export default function SipCalculator() {
  const tool = getToolBySlug("sip-calculator")!;
  const currency = useCurrency();
  const [mode, setMode] = useState<SipMode>("sip");

  const [monthlyAmount, setMonthlyAmount] = useState(5_000);
  const [lumpsumAmount, setLumpsumAmount] = useState(1_00_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    return mode === "sip"
      ? calculateSip(monthlyAmount, rate, years)
      : calculateLumpsum(lumpsumAmount, rate, years);
  }, [mode, monthlyAmount, lumpsumAmount, rate, years]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={modeOptions} value={mode} onChange={setMode} />

            <div className="flex flex-col gap-8 sm:gap-10">
              {mode === "sip" ? (
                <MoneySliderField
                  label="Monthly Investment"
                  valueInr={monthlyAmount}
                  minInr={500}
                  maxInr={2_00_000}
                  stepInr={500}
                  onChangeInr={setMonthlyAmount}
                />
              ) : (
                <MoneySliderField
                  label="Total Investment"
                  valueInr={lumpsumAmount}
                  minInr={10_000}
                  maxInr={50_00_000}
                  stepInr={5_000}
                  onChangeInr={setLumpsumAmount}
                />
              )}
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
                label="Time Period (Years)"
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
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.invested, color: "#363d0a" },
                  { value: result.returns, color: "#d9ff00" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                  Total Value
                </p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  <AnimatedNumber value={result.total} format={(v) => currency.format(v)} />
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: "Invested Amount", color: "#363d0a" },
                  { label: "Est. Returns", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Total Value"
              value={<AnimatedNumber value={result.total} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Invested Amount", value: currency.format(result.invested) },
                { label: "Estimated Returns", value: currency.format(result.returns) },
                { label: "Total Value", value: currency.format(result.total) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          A SIP (Systematic Investment Plan) compounds each monthly instalment at your expected return
          rate for however many months remain until your goal, so early instalments have more time to grow
          than later ones — this is why the future value formula weights each contribution by its own
          compounding period rather than treating the total as a single lump sum.
        </p>
        <p>
          Lumpsum mode instead compounds one upfront amount for the full period using standard compound
          interest. SIPs suit steady income and reduce the risk of investing everything at a market peak,
          while a lumpsum can outperform if invested right before a sustained rally — timing is the
          trade-off.
        </p>
      </ToolExplainer>
    </div>
  );
}
