"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shrinks a fixed-size (e.g. A4) document to fit whatever width is actually
 * available, so it reads as a scaled-down page rather than reflowing its
 * content — the same way document viewers show a page thumbnail.
 */
export function A4ScaledPreview({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const available = el.clientWidth;
      if (available > 0) setScale(Math.min(1, available / width));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: height * scale, overflow: "hidden" }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}
