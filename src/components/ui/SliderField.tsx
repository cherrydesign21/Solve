"use client";

import { Slider } from "./Slider";
import { NumberField } from "./NumberField";

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  minCaption: string;
  maxCaption: string;
  decimals?: number;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix,
  suffix,
  minCaption,
  maxCaption,
  decimals = 0,
}: SliderFieldProps) {
  return (
    <div className="flex w-full flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base sm:text-lg font-medium text-white">{label}</p>
        <NumberField
          value={value}
          onChange={onChange}
          prefix={prefix}
          suffix={suffix}
          min={min}
          max={max}
          decimals={decimals}
          ariaLabel={label}
          className="w-full sm:w-auto"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Slider value={value} min={min} max={max} step={step} onChange={onChange} ariaLabel={label} />
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] text-white/50">
          <span>{minCaption}</span>
          <span>{maxCaption}</span>
        </div>
      </div>
    </div>
  );
}
