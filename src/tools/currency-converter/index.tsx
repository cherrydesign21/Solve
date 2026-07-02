"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Pencil, RefreshCw, WifiOff } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Card } from "@/components/ui/Card";
import { SelectField } from "@/components/ui/SelectField";
import { NumberField } from "@/components/ui/NumberField";
import { getToolBySlug } from "@/lib/tools-registry";
import {
  CURRENCY_NAMES,
  FALLBACK_BASE,
  FALLBACK_RATES,
  convertCurrency,
  currencyList,
} from "./logic";

interface RatesState {
  base: string;
  date: string | null;
  rates: Record<string, number>;
  isLive: boolean;
  loading: boolean;
}

export default function CurrencyConverter() {
  const tool = getToolBySlug("currency-converter")!;
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(100);
  const [ratesState, setRatesState] = useState<RatesState>({
    base: FALLBACK_BASE,
    date: null,
    rates: FALLBACK_RATES,
    isLive: false,
    loading: true,
  });

  const fetchRates = async () => {
    setRatesState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${FALLBACK_BASE}`);
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as {
        result: string;
        base_code: string;
        time_last_update_utc: string;
        rates: Record<string, number>;
      };
      if (data.result !== "success") throw new Error("Request failed");
      setRatesState({
        base: data.base_code,
        date: data.time_last_update_utc,
        rates: { ...data.rates, [data.base_code]: 1 },
        isLive: true,
        loading: false,
      });
    } catch {
      setRatesState((prev) => ({ ...prev, loading: false, isLive: false }));
    }
  };

  useEffect(() => {
    // Standard fetch-on-mount: load live rates once, falling back to the static table on failure.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRates();
  }, []);

  const result = convertCurrency(amount, from, to, ratesState.rates, ratesState.base);
  const unitRate = convertCurrency(1, from, to, ratesState.rates, ratesState.base);

  const handleToChange = (nextTo: number) => {
    if (!Number.isFinite(unitRate) || unitRate === 0) return;
    setAmount(nextTo / unitRate);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const currencyOptions = currencyList.map((code) => ({
    value: code,
    label: `${code} — ${CURRENCY_NAMES[code] ?? code}`,
  }));

  return (
    <div>
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-white/50">
              {ratesState.isLive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span>
                    Live rates
                    {ratesState.date ? ` · ${new Date(ratesState.date).toLocaleDateString()}` : ""} (base{" "}
                    {ratesState.base})
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span>Using approximate offline rates</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={fetchRates}
              disabled={ratesState.loading}
              className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/60 transition-colors hover:text-white disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${ratesState.loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">From</p>
                <p className="flex items-center gap-1 text-[11px] text-white/30">
                  <Pencil className="h-3 w-3" /> Enter an amount
                </p>
              </div>
              <SelectField options={currencyOptions} value={from} onChange={setFrom} ariaLabel="From currency" />
              <NumberField
                value={amount}
                onChange={setAmount}
                decimals={2}
                ariaLabel="Amount"
                className="!border-0 !bg-transparent !px-0 !py-1 focus-within:ring-1 focus-within:ring-accent/40 rounded-md"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-accent/50 hover:text-accent"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>

            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent/80">To</p>
                <p className="flex items-center gap-1 text-[11px] text-white/30">
                  <Pencil className="h-3 w-3" /> Also editable
                </p>
              </div>
              <SelectField options={currencyOptions} value={to} onChange={setTo} ariaLabel="To currency" />
              <NumberField
                value={result}
                onChange={handleToChange}
                decimals={2}
                ariaLabel="Converted amount"
                className="!border-0 !bg-transparent !px-0 !py-1 focus-within:ring-1 focus-within:ring-accent/40 rounded-md"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>
          </div>

          <p className="text-center text-sm text-white/40">
            1 {from} = {Number.isFinite(unitRate) ? unitRate.toFixed(4) : "—"} {to}
          </p>
        </div>
      </Card>
    </div>
  );
}
