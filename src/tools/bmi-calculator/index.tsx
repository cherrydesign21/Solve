"use client";

import { useMemo, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { SliderField } from "@/components/ui/SliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { GaugeBar } from "@/components/ui/GaugeBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { bmiCategory, bmiZones, calculateBmi, healthyWeightRange } from "./logic";

export default function BmiCalculator() {
  const tool = getToolBySlug("bmi-calculator")!;
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  const bmi = useMemo(() => calculateBmi(weightKg, heightCm), [weightKg, heightCm]);
  const range = useMemo(() => healthyWeightRange(heightCm), [heightCm]);
  const category = bmiCategory(bmi);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
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

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Body Mass Index"
              value={<AnimatedNumber value={bmi} format={(v) => v.toFixed(1)} />}
              rows={[
                { label: "Category", value: category },
                { label: "Healthy Weight Range", value: `${formatNumber(range.min, 1)} – ${formatNumber(range.max, 1)} kg` },
              ]}
            />

            <Card className="p-5 sm:p-6">
              <GaugeBar value={bmi} min={12} max={40} zones={bmiZones} minLabel="12" maxLabel="40+" />
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        BMI is a general screening tool and doesn&apos;t account for muscle mass, bone density or body
        composition. It isn&apos;t a diagnosis — talk to a healthcare provider for personalized advice.
      </p>
    </div>
  );
}
