import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-[1px] font-display text-2xl font-bold uppercase tracking-[-0.02em] text-white ${className}`}
    >
      <span>S</span>
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full border-accent"
        style={{ width: "0.62em", height: "0.62em", borderWidth: "0.16em", borderStyle: "solid" }}
      />
      <span>LVE</span>
    </Link>
  );
}
