"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { SliderField } from "@/components/ui/SliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { DonutChart, DonutLegend } from "@/components/ui/DonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import type { Gender } from "@/lib/health";
import { activityLevels, calculateCalories, goalOptions, type Goal } from "./logic";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const goalTabOptions = goalOptions.map((g) => ({ value: g.id, label: g.label }));
const activityTabOptions = activityLevels.map((a) => ({ value: a.id, label: a.label }));

export default function CalorieCalculator() {
  const tool = getToolBySlug("calorie-calculator")!;
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [activityId, setActivityId] = useState(activityLevels[2].id);
  const [goal, setGoal] = useState<Goal>("maintain");

  const activity = activityLevels.find((a) => a.id === activityId) ?? activityLevels[2];
  const goalAdjustment = goalOptions.find((g) => g.id === goal)?.adjustment ?? 0;

  const result = useMemo(
    () => calculateCalories(gender, weightKg, heightCm, age, activity.multiplier, goalAdjustment),
    [gender, weightKg, heightCm, age, activity.multiplier, goalAdjustment]
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
              <SliderField label="Age" value={age} min={10} max={90} step={1} onChange={setAge} suffix="yrs" minCaption="10" maxCaption="90" />
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

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-white sm:text-lg">Activity Level</p>
              <Tabs options={activityTabOptions} value={activityId} onChange={setActivityId} />
              <p className="text-xs text-white/40">{activity.description}</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-white sm:text-lg">Goal</p>
              <Tabs options={goalTabOptions} value={goal} onChange={setGoal} />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Daily Target"
              value={<AnimatedNumber value={result.targetCalories} format={(v) => `${formatNumber(v)} kcal`} />}
              rows={[
                { label: "Maintenance (TDEE)", value: `${formatNumber(result.tdee)} kcal` },
                { label: "Basal Metabolic Rate", value: `${formatNumber(result.bmr)} kcal` },
              ]}
            />

            <div className="flex flex-col items-center gap-6">
              <DonutChart
                segments={[
                  { value: result.proteinG * 4, color: "#d9ff00" },
                  { value: result.carbsG * 4, color: "#363d0a" },
                  { value: result.fatG * 9, color: "#7c8a1c" },
                ]}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">Macros</p>
                <p className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                  {formatNumber(result.targetCalories)}
                </p>
              </DonutChart>
              <DonutLegend
                items={[
                  { label: `Protein ${formatNumber(result.proteinG)}g`, color: "#d9ff00" },
                  { label: `Carbs ${formatNumber(result.carbsG)}g`, color: "#363d0a" },
                  { label: `Fat ${formatNumber(result.fatG)}g`, color: "#7c8a1c" },
                ]}
              />
            </div>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
