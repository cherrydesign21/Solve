import type { ReactNode } from "react";

export function StaticPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-sm text-white/40">Last updated: {updated}</p>}
      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-white/60 sm:text-base">{children}</p>;
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm leading-relaxed text-white/60 sm:text-base">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
