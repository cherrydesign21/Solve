"use client";

import { SliderField } from "./SliderField";
import { useCurrency } from "@/lib/currency-context";
import { humanizeAmountCaption } from "@/lib/format";

interface MoneySliderFieldProps {
  label: string;
  valueInr: number;
  minInr: number;
  maxInr: number;
  stepInr: number;
  onChangeInr: (valueInr: number) => void;
}

/**
 * A SliderField whose underlying value/min/max/step are always canonical INR
 * (the currency the calculators' math is defined in), but is displayed and
 * edited in whatever currency the user has picked via live FX rates.
 */
export function MoneySliderField({ label, valueInr, minInr, maxInr, stepInr, onChangeInr }: MoneySliderFieldProps) {
  const { toDisplay, toInr, symbol, currency } = useCurrency();

  const displayMin = toDisplay(minInr);
  const displayMax = toDisplay(maxInr);
  const displayStep = Math.max(toDisplay(stepInr), 0.01);
  const decimals = currency === "INR" || currency === "JPY" ? 0 : 2;

  return (
    <SliderField
      label={label}
      value={toDisplay(valueInr)}
      min={displayMin}
      max={displayMax}
      step={displayStep}
      decimals={decimals}
      onChange={(v) => onChangeInr(toInr(v))}
      prefix={symbol}
      minCaption={`${symbol}${humanizeAmountCaption(displayMin, currency)}`}
      maxCaption={`${symbol}${humanizeAmountCaption(displayMax, currency)}`}
    />
  );
}
