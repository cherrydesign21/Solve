"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
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
import { calculateBmi } from "@/tools/bmi-calculator/logic";
import { getToolBySlug } from "@/lib/tools-registry";
import {
  alcoholOptions,
  calculateBiologicalAge,
  dietOptions,
  exerciseOptions,
  smokingOptions,
  stressOptions,
  type FactorOption,
} from "./logic";

function FactorSelector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FactorOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-white">{label}</p>
      <Tabs options={options.map((o) => ({ value: o.id, label: o.label }))} value={value} onChange={onChange} />
    </div>
  );
}

export default function BiologicalAgeCalculator() {
  const tool = getToolBySlug("biological-age-calculator")!;
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [sleepHours, setSleepHours] = useState(7);
  const [smoking, setSmoking] = useState(smokingOptions[0].id);
  const [exercise, setExercise] = useState(exerciseOptions[2].id);
  const [diet, setDiet] = useState(dietOptions[1].id);
  const [alcohol, setAlcohol] = useState(alcoholOptions[0].id);
  const [stress, setStress] = useState(stressOptions[1].id);

  const bmi = useMemo(() => calculateBmi(weightKg, heightCm), [weightKg, heightCm]);

  const biologicalAge = useMemo(
    () =>
      calculateBiologicalAge({
        chronologicalAge: age,
        bmi,
        sleepHours,
        smokingModifier: smokingOptions.find((o) => o.id === smoking)?.modifier ?? 0,
        exerciseModifier: exerciseOptions.find((o) => o.id === exercise)?.modifier ?? 0,
        dietModifier: dietOptions.find((o) => o.id === diet)?.modifier ?? 0,
        alcoholModifier: alcoholOptions.find((o) => o.id === alcohol)?.modifier ?? 0,
        stressModifier: stressOptions.find((o) => o.id === stress)?.modifier ?? 0,
      }),
    [age, bmi, sleepHours, smoking, exercise, diet, alcohol, stress]
  );

  const delta = Math.round(biologicalAge - age);
  const deltaLabel = delta === 0 ? "Right on track" : delta < 0 ? `${Math.abs(delta)} years younger` : `${delta} years older`;
  const deltaColor = delta === 0 ? "text-white/60" : delta < 0 ? "text-accent" : "text-orange-400";

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <div className="flex flex-col gap-8 sm:gap-10">
              <SliderField label="Age" value={age} min={15} max={90} step={1} onChange={setAge} suffix="yrs" minCaption="15" maxCaption="90" />
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
              <SliderField
                label="Average Sleep"
                value={sleepHours}
                min={3}
                max={11}
                step={0.5}
                decimals={1}
                onChange={setSleepHours}
                suffix="hrs"
                minCaption="3 hrs"
                maxCaption="11 hrs"
              />
            </div>

            <div className="flex flex-col gap-8">
              <FactorSelector label="Smoking" options={smokingOptions} value={smoking} onChange={setSmoking} />
              <FactorSelector label="Exercise Frequency" options={exerciseOptions} value={exercise} onChange={setExercise} />
              <FactorSelector label="Diet Quality" options={dietOptions} value={diet} onChange={setDiet} />
              <FactorSelector label="Alcohol Consumption" options={alcoholOptions} value={alcohol} onChange={setAlcohol} />
              <FactorSelector label="Stress Level" options={stressOptions} value={stress} onChange={setStress} />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Biological Age"
              value={<AnimatedNumber value={biologicalAge} format={(v) => `${Math.round(v)} yrs`} />}
              rows={[
                { label: "Chronological Age", value: `${age} yrs` },
                { label: "Compared to Actual Age", value: <span className={deltaColor}>{deltaLabel}</span> },
              ]}
            />

            <Card className="flex items-start gap-3 p-5 sm:p-6">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-xs text-white/40">
                This is a fun, illustrative wellness estimate based on lifestyle inputs — not a clinical or
                medically validated measurement of aging.
              </p>
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          This starts from your chronological age and applies small adjustments (a year or two either way)
          for each lifestyle factor — smoking, exercise frequency, diet quality, alcohol use, stress, sleep
          and BMI — based on how each one is generally associated with faster or slower aging in population
          research.
        </p>
        <p>
          It&apos;s a motivational snapshot, not a lab measurement — real biological age testing uses
          things like DNA methylation (epigenetic clocks) or blood biomarkers. Use this to see which habits
          are pulling your score up or down, not as a diagnosis.
        </p>
      </ToolExplainer>
    </div>
  );
}
