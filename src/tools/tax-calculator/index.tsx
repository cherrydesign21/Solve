"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateTax, type TaxRegime } from "./logic";

const regimeOptions: { value: TaxRegime; label: string }[] = [
  { value: "new", label: "New Regime" },
  { value: "old", label: "Old Regime" },
];

export default function TaxCalculator() {
  const tool = getToolBySlug("tax-calculator")!;
  const currency = useCurrency();
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [income, setIncome] = useState(12_00_000);
  const [deductions80c, setDeductions80c] = useState(1_50_000);
  const [otherDeductions, setOtherDeductions] = useState(50_000);

  const result = useMemo(
    () =>
      calculateTax({
        annualIncome: income,
        deductions80c,
        otherDeductions,
        regime,
      }),
    [income, deductions80c, otherDeductions, regime]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <p className="mb-6 -mt-4 max-w-xl text-xs text-white/40 sm:text-sm">
        Tax law and slabs shown are for India (old/new regime); amounts are just displayed in your chosen
        currency at the live exchange rate.
      </p>

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={regimeOptions} value={regime} onChange={setRegime} />

            <div className="flex flex-col gap-8 sm:gap-10">
              <MoneySliderField
                label="Annual Income"
                valueInr={income}
                minInr={2_00_000}
                maxInr={1_00_00_000}
                stepInr={10_000}
                onChangeInr={setIncome}
              />

              <AnimatePresence initial={false}>
                {regime === "old" && (
                  <motion.div
                    key="old-regime-deductions"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-8 overflow-hidden sm:gap-10"
                  >
                    <MoneySliderField
                      label="Section 80C Investments"
                      valueInr={deductions80c}
                      minInr={0}
                      maxInr={1_50_000}
                      stepInr={5_000}
                      onChangeInr={setDeductions80c}
                    />
                    <MoneySliderField
                      label="Other Deductions (80D, HRA, home loan interest)"
                      valueInr={otherDeductions}
                      minInr={0}
                      maxInr={5_00_000}
                      stepInr={5_000}
                      onChangeInr={setOtherDeductions}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.takeHome, color: "#363d0a" },
                  { value: result.totalTax, color: "#d9ff00" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                  Effective Rate
                </p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  <AnimatedNumber value={result.effectiveRate} format={(v) => `${v.toFixed(1)}%`} />
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: "Take-home", color: "#363d0a" },
                  { label: "Total Tax", color: "#d9ff00" },
                ]}
              />
            </div>

            <ResultCard
              heading="Total Tax Payable"
              value={<AnimatedNumber value={result.totalTax} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Taxable Income", value: currency.format(result.taxableIncome) },
                { label: "Health & Education Cess (4%)", value: currency.format(result.cess) },
                { label: "Take-home Income", value: currency.format(result.takeHome) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
