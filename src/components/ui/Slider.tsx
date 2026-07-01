"use client";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export function Slider({ value, min, max, step = 1, onChange, ariaLabel }: SliderProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      type="range"
      className="solve-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{
        background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
      }}
    />
  );
}
