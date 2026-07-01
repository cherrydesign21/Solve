"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { IndianRupee, CalendarClock, Leaf } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { SliderField } from "@/components/ui/SliderField";
import { Tabs } from "@/components/ui/Tabs";
import { ResultCard } from "@/components/ui/ResultCard";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatIndianCurrency, formatNumber, humanizeAmountCaption } from "@/lib/format";
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
    <div>
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
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
            <SliderField
              label="Cost per Unit"
              value={costPerUnit}
              min={3}
              max={12}
              step={0.5}
              decimals={1}
              onChange={setCostPerUnit}
              prefix="₹"
              minCaption="₹3"
              maxCaption="₹12"
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
            <SliderField
              label="Installed Cost per kW"
              value={costPerKw}
              min={35_000}
              max={80_000}
              step={1_000}
              onChange={setCostPerKw}
              prefix="₹"
              minCaption={humanizeAmountCaption(35_000)}
              maxCaption={humanizeAmountCaption(80_000)}
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
            <ResultCard
              heading="System Size Required"
              value={<AnimatedNumber value={result.systemSizeKw} format={(v) => `${v.toFixed(2)} kW`} />}
              rows={[
                { label: "Panels Required", value: `${result.panelCount} × ${panelWattage}W panels` },
                { label: "Roof Area Needed", value: `${formatNumber(result.areaRequiredSqm, 0)} m²` },
                { label: "Estimated System Cost", value: formatIndianCurrency(result.totalCost) },
              ]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <StatTile icon={IndianRupee} label="Monthly Savings" value={formatIndianCurrency(result.monthlySavings)} />
              <StatTile icon={CalendarClock} label="Payback Period" value={`${result.paybackYears.toFixed(1)} years`} />
              <StatTile icon={Leaf} label="CO₂ Offset / Year" value={`${result.co2OffsetTonnesPerYear.toFixed(2)} tonnes`} />
            </div>
          </div>
        </div>
      </Card>
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
