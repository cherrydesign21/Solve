"use client";

import { Search } from "lucide-react";

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-sm text-white/40 transition-colors hover:border-white/20 hover:text-white/60"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1">Search tools…</span>
      <kbd className="hidden shrink-0 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40 sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
