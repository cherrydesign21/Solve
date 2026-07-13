import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Compass className="h-6 w-6" />
      </span>
      <div>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-sm text-sm text-white/50 sm:text-base">
          That page doesn&apos;t exist, or the link may be out of date. Head back to the homepage to find the
          tool you&apos;re after.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
      >
        Back to Solve
      </Link>
    </div>
  );
}
