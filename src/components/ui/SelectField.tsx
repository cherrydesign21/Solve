"use client";

import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function SelectField({ options, value, onChange, className = "", ariaLabel }: SelectFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 pr-9 text-sm font-medium text-white outline-none transition-colors focus:border-accent/60 sm:text-base"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-panel text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
    </div>
  );
}
