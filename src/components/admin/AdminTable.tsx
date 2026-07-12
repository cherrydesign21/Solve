import type { ReactNode } from "react";

export interface AdminColumn {
  key: string;
  label: string;
  className?: string;
}

export function AdminTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: AdminColumn[];
  rows: Record<string, ReactNode>[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-sm text-white/40">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white/40 ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 align-top text-white/80 ${col.className ?? ""}`}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
