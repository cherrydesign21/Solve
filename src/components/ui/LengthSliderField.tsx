"use client";

import { useState } from "react";
import clsx from "clsx";
import { SliderField } from "./SliderField";
import { cmToUnit, unitToCm, formatFeetInches, type LengthUnit } from "@/lib/length";
import { formatNumber } from "@/lib/format";

interface LengthSliderFieldProps {
  label: string;
  valueCm: number;
  minCm: number;
  maxCm: number;
  stepCm?: number;
  onChangeCm: (cm: number) => void;
}

const unitOptions: { value: LengthUnit; label: string }[] = [
  { value: "cm", label: "cm" },
  { value: "in", label: "in" },
  { value: "ft", label: "ft" },
];

const stepFor: Record<LengthUnit, number> = { cm: 1, in: 0.5, ft: 0.05 };
const decimalsFor: Record<LengthUnit, number> = { cm: 0, in: 1, ft: 2 };

export function LengthSliderField({ label, valueCm, minCm, maxCm, stepCm, onChangeCm }: LengthSliderFieldProps) {
  const [unit, setUnit] = useState<LengthUnit>("cm");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-1">
        {unitOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setUnit(opt.value)}
            className={clsx(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              unit === opt.value ? "bg-accent text-black" : "bg-white/[0.06] text-white/50 hover:text-white"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SliderField
        label={label}
        value={cmToUnit(valueCm, unit)}
        min={cmToUnit(minCm, unit)}
        max={cmToUnit(maxCm, unit)}
        step={unit === "cm" ? (stepCm ?? 1) : stepFor[unit]}
        decimals={decimalsFor[unit]}
        onChange={(v) => onChangeCm(unitToCm(v, unit))}
        suffix={unit}
        minCaption={`${formatNumber(cmToUnit(minCm, unit), decimalsFor[unit])} ${unit}`}
        maxCaption={`${formatNumber(cmToUnit(maxCm, unit), decimalsFor[unit])} ${unit}`}
      />

      {unit !== "cm" && <p className="text-right text-xs text-white/30">≈ {formatFeetInches(valueCm)}</p>}
    </div>
  );
}
