"use client";

import clsx from "clsx";

interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ options, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      className={clsx(
        "flex w-full flex-wrap items-center gap-2 rounded-2xl bg-white/10 p-2 sm:flex-nowrap sm:rounded-full",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex-1 whitespace-nowrap rounded-full px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors duration-200 sm:px-6 sm:text-sm",
              active ? "bg-accent text-black" : "text-white/60 hover:text-white"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
