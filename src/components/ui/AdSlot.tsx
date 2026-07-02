interface AdSlotProps {
  className?: string;
  label?: string;
}

/**
 * Placeholder ad container. Swap the inner content for a real ad network
 * script/tag (e.g. an AdSense <ins> unit) once an account is set up —
 * the sizing and layout classes are already in place.
 */
function AdSlotBase({ className = "", label = "Advertisement", heightClass }: AdSlotProps & { heightClass: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-xs font-medium uppercase tracking-[0.16em] text-white/25 ${heightClass} ${className}`}
    >
      {label}
    </div>
  );
}

export function HorizontalAdSlot({ className, label }: AdSlotProps) {
  return <AdSlotBase className={className} label={label} heightClass="h-24 sm:h-28" />;
}

export function VerticalAdSlot({ className, label }: AdSlotProps) {
  return <AdSlotBase className={className} label={label} heightClass="h-64 lg:h-[400px]" />;
}
