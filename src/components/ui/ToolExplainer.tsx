import type { ReactNode } from "react";

interface ToolExplainerProps {
  heading?: string;
  children: ReactNode;
}

export function ToolExplainer({ heading = "How this calculator works", children }: ToolExplainerProps) {
  return (
    <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8">
      <h2 className="text-base font-semibold text-white sm:text-lg">{heading}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-white/50 sm:text-base">{children}</div>
    </div>
  );
}
