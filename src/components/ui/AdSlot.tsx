"use client";

import { useEffect, useId, useRef } from "react";
import { useAdSettings } from "@/lib/adsense-context";

interface AdSlotProps {
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function AdUnit({ publisherId, slotId, className }: { publisherId: string; slotId: string; className: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !insRef.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("[adsense] failed to render ad unit:", error);
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={publisherId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

/**
 * Renders a real AdSense unit once AdSense is enabled and configured from the
 * admin settings panel; otherwise falls back to a placeholder box so layout
 * spacing stays identical before/after approval.
 */
function AdSlotBase({
  className = "",
  label = "Advertisement",
  heightClass,
  slotId,
}: AdSlotProps & { heightClass: string; slotId: "horizontalSlotId" | "verticalSlotId" }) {
  const settings = useAdSettings();
  const uid = useId();
  const slot = settings[slotId];

  if (settings.enabled && settings.publisherId && slot) {
    return <AdUnit key={uid} publisherId={settings.publisherId} slotId={slot} className={className} />;
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-xs font-medium uppercase tracking-[0.16em] text-white/25 ${heightClass} ${className}`}
    >
      {label}
    </div>
  );
}

export function HorizontalAdSlot({ className, label }: AdSlotProps) {
  return <AdSlotBase className={className} label={label} heightClass="h-24 sm:h-28" slotId="horizontalSlotId" />;
}

export function VerticalAdSlot({ className, label }: AdSlotProps) {
  return <AdSlotBase className={className} label={label} heightClass="h-64 lg:h-[400px]" slotId="verticalSlotId" />;
}
