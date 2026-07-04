"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculatePropertyTax } from "./logic";

export default function PropertyTaxCalculator() {
  const tool = getToolBySlug("property-tax-calculator")!;
  const currency = useCurrency();

  const [propertyValue, setPropertyValue] = useState(50_00_000);
  const [assessmentRatioPct, setAssessmentRatioPct] = useState(100);
  const [taxRatePct, setTaxRatePct] = useState(0.5);
  const [exemption, setExemption] = useState(0);

  const result = useMemo(
    () => calculatePropertyTax({ propertyValue, assessmentRatioPct, taxRatePct, exemption }),
    [propertyValue, assessmentRatioPct, taxRatePct, exemption]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <MoneySliderField
              label="Property Value"
              valueInr={propertyValue}
              minInr={5_00_000}
              maxInr={5_00_00_000}
              stepInr={1_00_000}
              onChangeInr={setPropertyValue}
            />
            <SliderField
              label="Assessment Ratio"
              value={assessmentRatioPct}
              min={10}
              max={100}
              step={1}
              onChange={setAssessmentRatioPct}
              suffix="%"
              minCaption="10%"
              maxCaption="100%"
            />
            <SliderField
              label="Annual Tax Rate"
              value={taxRatePct}
              min={0.05}
              max={3}
              step={0.05}
              decimals={2}
              onChange={setTaxRatePct}
              suffix="%"
              minCaption="0.05%"
              maxCaption="3%"
            />
            <MoneySliderField
              label="Exemption / Deduction"
              valueInr={exemption}
              minInr={0}
              maxInr={propertyValue}
              stepInr={10_000}
              onChangeInr={setExemption}
            />
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Annual Property Tax"
              value={<AnimatedNumber value={result.annualTax} format={(v) => currency.format(v)} />}
              rows={[
                { label: "Monthly Equivalent", value: currency.format(result.monthlyTax) },
                { label: "Assessed Value", value: currency.format(result.assessedValue) },
                { label: "Effective Tax Rate", value: `${formatNumber(result.effectiveRatePct, 2)}%` },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        Assessment ratio and tax rate vary widely by local jurisdiction — check your municipal records for exact figures.
      </p>

      <ToolExplainer>
        <p>
          Most jurisdictions don&apos;t tax your property&apos;s full market value — they apply an
          assessment ratio first (often well under 100%) to get an &quot;assessed value,&quot; then apply
          the local tax rate to that smaller number. Any exemption (like a homestead exemption) is
          subtracted before the rate is applied.
        </p>
        <p>
          Because assessment ratios and rates are set locally and change over time, this is best used to
          sanity-check a number you already have or to compare scenarios — always confirm the current
          figures with your local assessor&apos;s office before budgeting around them.
        </p>
      </ToolExplainer>
    </div>
  );
}
