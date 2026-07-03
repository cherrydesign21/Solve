"use client";

import { useState, type ChangeEvent } from "react";
import { formatNumber } from "@/lib/format";

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  decimals?: number;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
  id?: string;
}

export function NumberField({
  value,
  onChange,
  prefix,
  suffix,
  min = -Infinity,
  max = Infinity,
  decimals = 0,
  className = "",
  inputClassName = "text-sm sm:text-base",
  ariaLabel,
  id,
}: NumberFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [raw, setRaw] = useState(() => formatNumber(value, decimals));
  const [synced, setSynced] = useState({ value, decimals });

  if (!isFocused && (value !== synced.value || decimals !== synced.decimals)) {
    setSynced({ value, decimals });
    setRaw(formatNumber(value, decimals));
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/[^0-9.]/g, "");
    setRaw(next);
    if (next === "") return;
    const parsed = parseFloat(next);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setRaw(value === 0 ? "" : String(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(raw);
    const fallback = Number.isFinite(min) ? min : 0;
    const clamped = Number.isNaN(parsed) ? fallback : Math.min(max, Math.max(min, parsed));
    onChange(clamped);
    setRaw(formatNumber(clamped, decimals));
  };

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 rounded-md border border-white/15 bg-white/[0.06] px-3 sm:px-5 py-2.5 sm:py-3 text-white/80 ${className}`}
    >
      {prefix && <span className="shrink-0 text-xs sm:text-sm tracking-wide text-white/50">{prefix}</span>}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={raw}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full min-w-0 cursor-text bg-transparent text-right font-medium text-white outline-none tabular-nums ${inputClassName}`}
      />
      {suffix && <span className="shrink-0 text-xs sm:text-sm tracking-wide text-white/50">{suffix}</span>}
    </div>
  );
}
