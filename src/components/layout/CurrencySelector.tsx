"use client";

import { CURRENCIES, useCurrency } from "@/lib/currency-context";
import { SelectField } from "@/components/ui/SelectField";

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency, isLive } = useCurrency();

  const options = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.symbol} ${c.code} — ${c.label}`,
  }));

  return (
    <div className={className}>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
        Currency{isLive ? "" : " (offline)"}
      </p>
      <SelectField options={options} value={currency} onChange={setCurrency} ariaLabel="Display currency" />
    </div>
  );
}
