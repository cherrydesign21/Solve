"use client";

import { useAnimatedNumber } from "@/lib/hooks/useAnimatedNumber";

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const animated = useAnimatedNumber(value);
  const formatted = format ? format(animated) : Math.round(animated).toString();
  return <span className={className}>{formatted}</span>;
}
