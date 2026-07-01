import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-[3px] font-display text-2xl font-medium tracking-wide text-white ${className}`}
    >
      <span>S</span>
      <span className="inline-block h-[0.5em] w-[0.5em] rounded-full bg-accent" />
      <span>lve</span>
    </Link>
  );
}
