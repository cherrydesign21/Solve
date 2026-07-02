import type { BackdropIcon } from "@/lib/tool-backdrops";

export function ToolBackdrop({ icons }: { icons: BackdropIcon[] }) {
  if (icons.length === 0) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {icons.map(({ icon: Icon, className }, i) => (
        <Icon key={i} strokeWidth={1} className={`absolute text-white ${className}`} />
      ))}
    </div>
  );
}
