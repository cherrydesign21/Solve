"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import type { Gender } from "@/lib/health";
import { calculateSteps } from "./logic";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function StepsCalculator() {
  const tool = getToolBySlug("steps-calculator")!;
  const [gender, setGender] = useState<Gender>("male");
  const [steps, setSteps] = useState(8000);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);

  const result = useMemo(
    () => calculateSteps(steps, weightKg, heightCm, gender),
    [steps, weightKg, heightCm, gender]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={genderOptions} value={gender} onChange={setGender} />

            <div className="flex flex-col gap-8 sm:gap-10">
              <SliderField
                label="Steps"
                value={steps}
                min={0}
                max={30000}
                step={100}
                onChange={setSteps}
                minCaption="0"
                maxCaption="30,000"
              />
              <SliderField
                label="Height"
                value={heightCm}
                min={120}
                max={220}
                step={1}
                onChange={setHeightCm}
                suffix="cm"
                minCaption="120 cm"
                maxCaption="220 cm"
              />
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
              heading="Calories Burned"
              value={<AnimatedNumber value={result.calories} format={(v) => `${formatNumber(v)} kcal`} />}
              rows={[
                { label: "Distance Covered", value: `${result.distanceKm.toFixed(2)} km` },
                { label: "Active Time", value: `${formatNumber(result.activeMinutes)} min` },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
