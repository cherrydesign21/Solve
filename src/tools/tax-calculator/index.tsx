"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { SelectField } from "@/components/ui/SelectField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatCurrency } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateTax, countries, getCountry, type CountryCode, type TaxRegime } from "./logic";

const regimeOptions: { value: TaxRegime; label: string }[] = [
  { value: "new", label: "New Regime" },
  { value: "old", label: "Old Regime" },
];

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  CAD: "$",
  AUD: "$",
  EUR: "€",
  JPY: "¥",
  RUB: "₽",
};

export default function TaxCalculator() {
  const tool = getToolBySlug("tax-calculator")!;
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const country = getCountry(countryCode);

  const [incomeByCountry, setIncomeByCountry] = useState<Record<CountryCode, number>>(() =>
    Object.fromEntries(countries.map((c) => [c.code, c.incomeDefault])) as Record<CountryCode, number>
  );
  const income = incomeByCountry[countryCode];
  const setIncome = (value: number) => setIncomeByCountry((prev) => ({ ...prev, [countryCode]: value }));

  const [regime, setRegime] = useState<TaxRegime>("new");
  const [deductions80c, setDeductions80c] = useState(1_50_000);
  const [otherDeductions, setOtherDeductions] = useState(50_000);

  const result = useMemo(
    () => calculateTax(countryCode, income, { regime, deductions80c, otherDeductions }),
    [countryCode, income, regime, deductions80c, otherDeductions]
  );

  const format = (value: number) => formatCurrency(value, country.currencyCode, country.locale, 0);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <div className="mb-6 -mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs text-white/40 sm:text-sm">{country.note}</p>
        <div className="w-full sm:w-56">
          <SelectField options={countryOptions} value={countryCode} onChange={(v) => setCountryCode(v as CountryCode)} ariaLabel="Country" />
        </div>
      </div>

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            {countryCode === "IN" && <Tabs options={regimeOptions} value={regime} onChange={setRegime} />}

            <div className="flex flex-col gap-8 sm:gap-10">
              <SliderField
                label="Annual Income"
                value={income}
                min={country.incomeMin}
                max={country.incomeMax}
                step={country.incomeStep}
                onChange={setIncome}
                prefix={CURRENCY_SYMBOLS[country.currencyCode] ?? country.currencyCode}
                minCaption={format(country.incomeMin)}
                maxCaption={format(country.incomeMax)}
              />

              <AnimatePresence initial={false}>
                {countryCode === "IN" && regime === "old" && (
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
                      minCaption={format(0)}
                      maxCaption={format(1_50_000)}
                    />
                    <SliderField
                      label="Other Deductions (80D, HRA, home loan interest)"
                      value={otherDeductions}
                      min={0}
                      max={5_00_000}
                      step={5_000}
                      onChange={setOtherDeductions}
                      prefix="₹"
                      minCaption={format(0)}
                      maxCaption={format(5_00_000)}
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
              value={<AnimatedNumber value={result.totalTax} format={(v) => format(v)} />}
              rows={[
                { label: "Taxable Income", value: format(result.taxableIncome) },
                ...(result.levy > 0 ? [{ label: result.levyLabel, value: format(result.levy) }] : []),
                { label: "Take-home Income", value: format(result.takeHome) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          Income tax is progressive almost everywhere: your income is sliced into bands, and each slice is
          taxed at its own rate, not the top rate applied to your whole income. A standard deduction (or
          personal allowance) is subtracted first, so only income above that threshold is taxed at all.
        </p>
        <p>
          Switch the country selector to compare systems — the mix of bracket widths, deduction size and
          any extra levy (like India&apos;s cess or Japan&apos;s local tax) is what makes otherwise similar
          incomes end up with very different effective tax rates around the world.
        </p>
      </ToolExplainer>
    </div>
  );
}
