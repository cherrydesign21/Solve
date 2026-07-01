"use client";

import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ value, onChange, className = "", ...rest }: TextFieldProps) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent/60 [color-scheme:dark] sm:text-base ${className}`}
    />
  );
}
