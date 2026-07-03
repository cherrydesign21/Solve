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
import { calculateProtein, proteinLevels } from "./logic";

const levelTabOptions = proteinLevels.map((l) => ({ value: l.id, label: l.label }));

export default function ProteinIntakeCalculator() {
  const tool = getToolBySlug("protein-intake-calculator")!;
  const [weightKg, setWeightKg] = useState(70);
  const [levelId, setLevelId] = useState(proteinLevels[1].id);

  const level = proteinLevels.find((l) => l.id === levelId) ?? proteinLevels[1];
  const dailyProtein = useMemo(() => calculateProtein(weightKg, level.gPerKg), [weightKg, level.gPerKg]);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <SliderField
              label="Body Weight"
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

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-white sm:text-lg">Activity Level</p>
              <Tabs options={levelTabOptions} value={levelId} onChange={setLevelId} />
              <p className="text-xs text-white/40">
                {level.description} — {level.gPerKg} g protein per kg of body weight
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Daily Protein Target"
              value={<AnimatedNumber value={dailyProtein} format={(v) => `${formatNumber(v)}g`} />}
              rows={[
                { label: "Calories from Protein", value: `${formatNumber(dailyProtein * 4)} kcal` },
                { label: "Per Meal (3 meals/day)", value: `${formatNumber(dailyProtein / 3)}g` },
                { label: "Per Meal (4 meals/day)", value: `${formatNumber(dailyProtein / 4)}g` },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
