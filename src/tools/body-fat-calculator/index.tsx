"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { LengthSliderField } from "@/components/ui/LengthSliderField";
import { ResultCard } from "@/components/ui/ResultCard";
import { GaugeBar } from "@/components/ui/GaugeBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { getToolBySlug } from "@/lib/tools-registry";
import type { Gender } from "@/lib/health";
import { bodyFatZonesFemale, bodyFatZonesMale, calculateBodyFat } from "./logic";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function BodyFatCalculator() {
  const tool = getToolBySlug("body-fat-calculator")!;
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState(170);
  const [neckCm, setNeckCm] = useState(38);
  const [waistCm, setWaistCm] = useState(85);
  const [hipCm, setHipCm] = useState(95);

  const bodyFat = useMemo(
    () => calculateBodyFat(gender, heightCm, neckCm, waistCm, hipCm),
    [gender, heightCm, neckCm, waistCm, hipCm]
  );
  const zones = gender === "male" ? bodyFatZonesMale : bodyFatZonesFemale;
  const category = zones.find((z) => bodyFat <= z.upTo)?.label ?? zones[zones.length - 1].label;

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-10 lg:gap-12">
            <Tabs options={genderOptions} value={gender} onChange={setGender} />

            <div className="flex flex-col gap-8 sm:gap-10">
              <LengthSliderField label="Height" valueCm={heightCm} minCm={120} maxCm={220} onChangeCm={setHeightCm} />
              <LengthSliderField label="Neck" valueCm={neckCm} minCm={25} maxCm={60} onChangeCm={setNeckCm} />
              <LengthSliderField label="Waist" valueCm={waistCm} minCm={50} maxCm={160} onChangeCm={setWaistCm} />
              <AnimatePresence initial={false}>
                {gender === "female" && (
                  <motion.div
                    key="hip-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <LengthSliderField label="Hip" valueCm={hipCm} minCm={60} maxCm={170} onChangeCm={setHipCm} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Body Fat"
              value={<AnimatedNumber value={bodyFat} format={(v) => `${v.toFixed(1)}%`} />}
              rows={[{ label: "Category", value: category }]}
            />

            <Card className="p-5 sm:p-6">
              <GaugeBar value={bodyFat} min={0} max={45} zones={zones} minLabel="0%" maxLabel="45%+" />
            </Card>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-white/30">
        Estimated using the U.S. Navy circumference method. Accuracy varies by body type — for precise
        readings, consider a DEXA scan or skinfold measurement.
      </p>

      <ToolExplainer>
        <p>
          The U.S. Navy method estimates body fat from a log-based formula using neck, waist and (for
          women) hip circumference relative to height — no calipers or scanning equipment needed, just a
          tape measure. It was developed for military fitness screening and is popular because it&apos;s
          simple and repeatable.
        </p>
        <p>
          Measure at the narrowest point of your waist and directly below your Adam&apos;s apple for the
          neck, using a soft tape pulled snug but not tight. Measuring at the same time of day, on an empty
          stomach, gives the most consistent readings over time.
        </p>
      </ToolExplainer>
    </div>
  );
}
