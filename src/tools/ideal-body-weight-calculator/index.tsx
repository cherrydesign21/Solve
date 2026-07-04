"use client";

import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { LengthSliderField } from "@/components/ui/LengthSliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import type { Gender } from "@/lib/health";
import { calculateIdealWeight } from "./logic";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function IdealBodyWeightCalculator() {
  const tool = getToolBySlug("ideal-body-weight-calculator")!;
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState(170);

  const result = useMemo(() => calculateIdealWeight(gender, heightCm), [gender, heightCm]);

  const formulas = [
    { label: "Devine (1974)", value: result.devine },
    { label: "Robinson (1983)", value: result.robinson },
    { label: "Miller (1983)", value: result.miller },
    { label: "Hamwi (1964)", value: result.hamwi },
  ];

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={genderOptions} value={gender} onChange={setGender} />

            <LengthSliderField label="Height" valueCm={heightCm} minCm={140} maxCm={210} onChangeCm={setHeightCm} />
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Ideal Body Weight"
              value={<AnimatedNumber value={result.average} format={(v) => `${v.toFixed(1)} kg`} />}
              rows={[
                { label: "Healthy Range", value: `${formatNumber(result.min, 1)} – ${formatNumber(result.max, 1)} kg` },
              ]}
            />

            <Card className="flex flex-col gap-3 p-5 sm:p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                <Scale className="h-3.5 w-3.5 text-accent" />
                By formula
              </p>
              {formulas.map((f) => (
                <div key={f.label} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                  <p className="text-sm text-white/60">{f.label}</p>
                  <p className="text-sm font-semibold text-white">{f.value.toFixed(1)} kg</p>
                </div>
              ))}
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        These formulas were originally developed for medication dosing, not fitness goals — treat the range
        as a general reference point, not a strict target.
      </p>

      <ToolExplainer>
        <p>
          Devine (1974), Robinson (1983), Miller (1983) and Hamwi (1964) each estimate a baseline weight for
          a given height, then adjust it slightly by gender — all four start from a base weight for 5 feet
          of height and add a fixed amount per extra inch. They were designed by doctors to standardize drug
          dosing calculations, which is why they don&apos;t account for frame size, muscle mass or ethnicity.
        </p>
        <p>
          Because the four formulas use slightly different per-inch increments, they rarely agree exactly —
          seeing the full spread here (rather than a single number) gives a more honest picture than any one
          formula alone.
        </p>
      </ToolExplainer>
    </div>
  );
}
