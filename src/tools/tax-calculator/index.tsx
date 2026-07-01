"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { formatIndianCurrency, humanizeAmountCaption } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateTax, type TaxRegime } from "./logic";

const regimeOptions: { value: TaxRegime; label: string }[] = [
  { value: "new", label: "New Regime" },
  { value: "old", label: "Old Regime" },
];

export default function TaxCalculator() {
  const tool = getToolBySlug("tax-calculator")!;
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
    <div>
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-10 lg:gap-12">
          <Tabs options={regimeOptions} value={regime} onChange={setRegime} />

          <div className="flex flex-col gap-8 sm:gap-10">
            <SliderField
              label="Annual Income"
              value={income}
              min={2_00_000}
              max={1_00_00_000}
              step={10_000}
              onChange={setIncome}
              prefix="₹"
              minCaption={humanizeAmountCaption(2_00_000)}
              maxCaption={humanizeAmountCaption(1_00_00_000)}
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
                  <SliderField
                    label="Section 80C Investments"
                    value={deductions80c}
                    min={0}
                    max={1_50_000}
                    step={5_000}
                    onChange={setDeductions80c}
                    prefix="₹"
                    minCaption="₹0"
                    maxCaption={humanizeAmountCaption(1_50_000)}
                  />
                  <SliderField
                    label="Other Deductions (80D, HRA, home loan interest)"
                    value={otherDeductions}
                    min={0}
                    max={5_00_000}
                    step={5_000}
                    onChange={setOtherDeductions}
                    prefix="₹"
                    minCaption="₹0"
                    maxCaption={humanizeAmountCaption(5_00_000)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-between">
            <ResultCard
              className="w-full lg:max-w-[420px]"
              heading="Total Tax Payable"
              value={<AnimatedNumber value={result.totalTax} format={(v) => formatIndianCurrency(v)} />}
              rows={[
                { label: "Taxable Income", value: formatIndianCurrency(result.taxableIncome) },
                { label: "Health & Education Cess (4%)", value: formatIndianCurrency(result.cess) },
                { label: "Take-home Income", value: formatIndianCurrency(result.takeHome) },
              ]}
            />

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
          </div>
        </div>
      </Card>
    </div>
  );
}
