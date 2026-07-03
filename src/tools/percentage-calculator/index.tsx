"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Tabs } from "@/components/ui/Tabs";
import { NumberField } from "@/components/ui/NumberField";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculatePercentage, modeConfigs, type PercentageMode } from "./logic";

const tabOptions = modeConfigs.map((m) => ({ value: m.id, label: m.tabLabel }));

export default function PercentageCalculator() {
  const tool = getToolBySlug("percentage-calculator")!;
  const [mode, setMode] = useState<PercentageMode>("percent-of");
  const [x, setX] = useState(20);
  const [y, setY] = useState(150);

  const config = modeConfigs.find((m) => m.id === mode) ?? modeConfigs[0];
  const result = calculatePercentage(mode, x, y);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="mx-auto max-w-2xl p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          <Tabs options={tabOptions} value={mode} onChange={setMode} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{config.xLabel}</p>
              <NumberField
                value={x}
                onChange={setX}
                decimals={2}
                ariaLabel={config.xLabel}
                className="!border-0 !bg-transparent !px-0 !py-1"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{config.yLabel}</p>
              <NumberField
                value={y}
                onChange={setY}
                decimals={2}
                ariaLabel={config.yLabel}
                className="!border-0 !bg-transparent !px-0 !py-1"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-accent px-6 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/70 sm:text-sm">
                {config.resultLabel}
              </p>
              <p className="text-3xl font-bold text-black sm:text-4xl">
                <AnimatedNumber value={result} format={(v) => `${formatNumber(v, 2)}${config.suffix}`} />
              </p>
            </div>
            <div className="bg-white/[0.04] px-6 py-4 sm:px-8">
              <p className="text-sm text-white/50">{config.describe(x, y, result)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
