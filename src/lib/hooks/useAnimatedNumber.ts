"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly tweens a displayed number toward `target` whenever it changes,
 * so calculator results glide instead of jumping on every keystroke.
 */
export function useAnimatedNumber(target: number, duration = 450): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    fromRef.current = display;
    startRef.current = null;

    const from = fromRef.current;
    const delta = target - from;

    if (Math.abs(delta) < 0.005) {
      setDisplay(target);
      return;
    }

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}
