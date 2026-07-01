import type { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ToolHeader({ icon: Icon, title, description }: ToolHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-4 sm:mb-10">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{description}</p>
      </div>
    </div>
  );
}
