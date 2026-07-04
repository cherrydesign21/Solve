"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Wallet, CalendarClock, Leaf } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { SliderField } from "@/components/ui/SliderField";
import { MoneySliderField } from "@/components/ui/MoneySliderField";
import { Tabs } from "@/components/ui/Tabs";
import { ResultCard } from "@/components/ui/ResultCard";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateSolar } from "./logic";

const wattageOptions = [
  { value: "330", label: "330W" },
  { value: "400", label: "400W" },
  { value: "450", label: "450W" },
  { value: "550", label: "550W" },
];

export default function SolarPanelCalculator() {
  const tool = getToolBySlug("solar-panel-calculator")!;
  const currency = useCurrency();
  const [monthlyUnits, setMonthlyUnits] = useState(300);
  const [costPerUnit, setCostPerUnit] = useState(8);
  const [sunHours, setSunHours] = useState(5);
  const [panelWattage, setPanelWattage] = useState("400");
  const [costPerKw, setCostPerKw] = useState(55_000);

  const result = useMemo(
    () =>
      calculateSolar({
        monthlyUnits,
        costPerUnit,
        sunHours,
        panelWattage: parseInt(panelWattage, 10),
        costPerKw,
      }),
    [monthlyUnits, costPerUnit, sunHours, panelWattage, costPerKw]
  );

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <SliderField
              label="Monthly Electricity Usage"
              value={monthlyUnits}
              min={50}
              max={2000}
              step={10}
              onChange={setMonthlyUnits}
              suffix="kWh"
              minCaption="50 kWh"
              maxCaption="2000 kWh"
            />
            <MoneySliderField
              label="Cost per Unit"
              valueInr={costPerUnit}
              minInr={3}
              maxInr={12}
              stepInr={0.5}
              onChangeInr={setCostPerUnit}
            />
            <SliderField
              label="Average Peak Sunlight"
              value={sunHours}
              min={3}
              max={7}
              step={0.1}
              decimals={1}
              onChange={setSunHours}
              suffix="hrs/day"
              minCaption="3 hrs"
              maxCaption="7 hrs"
            />
            <MoneySliderField
              label="Installed Cost per kW"
              valueInr={costPerKw}
              minInr={35_000}
              maxInr={80_000}
              stepInr={1_000}
              onChangeInr={setCostPerKw}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-medium text-white sm:text-lg">Panel Wattage</p>
              <Tabs
                options={wattageOptions}
                value={panelWattage}
                onChange={setPanelWattage}
                className="sm:w-auto sm:min-w-[320px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="System Size Required"
              value={<AnimatedNumber value={result.systemSizeKw} format={(v) => `${v.toFixed(2)} kW`} />}
              rows={[
                { label: "Panels Required", value: `${result.panelCount} × ${panelWattage}W panels` },
                { label: "Roof Area Needed", value: `${formatNumber(result.areaRequiredSqm, 0)} m²` },
                { label: "Estimated System Cost", value: currency.format(result.totalCost) },
              ]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <StatTile icon={Wallet} label="Monthly Savings" value={currency.format(result.monthlySavings)} />
              <StatTile icon={CalendarClock} label="Payback Period" value={`${result.paybackYears.toFixed(1)} years`} />
              <StatTile icon={Leaf} label="CO₂ Offset / Year" value={`${result.co2OffsetTonnesPerYear.toFixed(2)} tonnes`} />
            </div>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          System size is worked out from how much energy you actually use: your monthly usage is converted
          to a daily average, then divided by your local peak sunlight hours to find the kW capacity needed
          to cover it. Panel count follows from dividing that capacity by your chosen panel wattage.
        </p>
        <p>
          Payback period compares the upfront installed cost against the monthly savings from electricity
          you no longer buy from the grid — it doesn&apos;t account for financing costs, subsidies, or
          panel degradation over time, all of which can shift the real-world payback in either direction.
        </p>
      </ToolExplainer>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className="mt-0.5 text-lg font-semibold text-white">{value}</p>
      </div>
    </Card>
  );
}
