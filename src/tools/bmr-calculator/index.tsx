"use client";

import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { LengthSliderField } from "@/components/ui/LengthSliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { activityLevels, calculateBmr, type Gender } from "./logic";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function BmrCalculator() {
  const tool = getToolBySlug("bmr-calculator")!;
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  const bmr = useMemo(() => calculateBmr(gender, weightKg, heightCm, age), [gender, weightKg, heightCm, age]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={genderOptions} value={gender} onChange={setGender} />

            <div className="flex flex-col gap-8 sm:gap-10">
              <SliderField label="Age" value={age} min={10} max={90} step={1} onChange={setAge} suffix="yrs" minCaption="10" maxCaption="90" />
              <LengthSliderField label="Height" valueCm={heightCm} minCm={120} maxCm={220} onChangeCm={setHeightCm} />
              <SliderField
                label="Weight"
                value={weightKg}
                min={30}
                max={180}
                step={0.5}
                decimals={1}
                onChange={setWeightKg}
                suffix="kg"
                minCaption="30 kg"
                maxCaption="180 kg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Basal Metabolic Rate"
              value={<AnimatedNumber value={bmr} format={(v) => `${formatNumber(v)} kcal`} />}
              rows={[{ label: "Calories your body burns at complete rest, per day", value: `${formatNumber(bmr)} kcal` }]}
            />

            <Card className="flex flex-col gap-3 p-5 sm:p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                <Flame className="h-3.5 w-3.5 text-accent" />
                Calories burned per day by activity
              </p>
              {activityLevels.map((level) => (
                <div key={level.id} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{level.label}</p>
                    <p className="text-xs text-white/40">{level.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatNumber(bmr * level.multiplier)} kcal</p>
                </div>
              ))}
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          This uses the Mifflin-St Jeor equation, generally considered the most accurate BMR formula for
          most people: for men, BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5; for women, the
          same calculation minus 161. It estimates the calories your body burns just staying alive —
          breathing, circulating blood, keeping you warm — before any movement is counted.
        </p>
        <p>
          The activity breakdown multiplies your BMR by a factor for how much you move day-to-day, giving
          your Total Daily Energy Expenditure (TDEE) at each level — a more useful number if you&apos;re
          planning calorie intake for weight loss, maintenance or gain.
        </p>
      </ToolExplainer>
    </div>
  );
}
